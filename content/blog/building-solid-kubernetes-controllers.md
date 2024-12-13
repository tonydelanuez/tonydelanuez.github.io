---
title: "Building Solid Kubernetes Controllers"
date: 2024-12-13T17:50:05-06:00
draft: false
author: "Tony"
tags: ['kubernetes']
categories: ['blog']
draft: false
---

In the last post, I explained the utility and purpose of Kubernetes Controllers. This post will explain how to build them, and how to think about designing them. We'll go into Controller patterns, anti-patterns, and sharp edges of the model that you're bound to run into.

# controller-runtime - use it.

Or don't, I don't care. It'll probably help though.

You can absolutely build a controller from scratch using `client-go` (and sometimes that makes sense), but most of the time you should just get started with [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime). It provides a batteries-included approach to handling **typical** Kubernetes controller patterns and gives you everything you need when it comes to things like leader election (you want HA, right?), metrics & events, caching, and even webhook setup and serving. When you just need to watch some resources and have your controller reconcile some state when the resource changes, `controller-runtime` is awesome.

If you need super fine-grained control over the watching behavior or caching (for perf or scaling reasons or otherwise), you'll probably find yourself poking too many holes through the Watch/Owns abstraction and should consider something a bit more bespoke.

Additionally, if you have extremely complex state machine transitions or want to take actions against different *kinds* of updates (create/delete/update) against your resources, the standard `.Reconcile(object)` approach that `controller-runtime` gives you may leave you fighting against the framework.

Here's an extremely simple example controller implementation from their [examples](https://github.com/kubernetes-sigs/controller-runtime/tree/main/examples/builtins):
```
// reconcileReplicaSet reconciles ReplicaSets
type reconcileReplicaSet struct {
	// client can be used to retrieve objects from the APIServer.
	client client.Client
}

// Implement reconcile.Reconciler so the controller can reconcile objects
var _ reconcile.Reconciler = &reconcileReplicaSet{}

func (r *reconcileReplicaSet) Reconcile(ctx context.Context, request reconcile.Request) (reconcile.Result, error) {
	// set up a convenient log object so we don't have to type request over and over again
	log := log.FromContext(ctx)

	// Fetch the ReplicaSet from the cache
	rs := &appsv1.ReplicaSet{}
	err := r.client.Get(ctx, request.NamespacedName, rs)
	if errors.IsNotFound(err) {
		log.Error(nil, "Could not find ReplicaSet")
		return reconcile.Result{}, nil
	}

	if err != nil {
		return reconcile.Result{}, fmt.Errorf("could not fetch ReplicaSet: %+v", err)
	}

	// Print the ReplicaSet
	log.Info("Reconciling ReplicaSet", "container name", rs.Spec.Template.Spec.Containers[0].Name)

	// Set the label if it is missing
	if rs.Labels == nil {
		rs.Labels = map[string]string{}
	}
	if rs.Labels["hello"] == "world" {
		return reconcile.Result{}, nil
	}

	// Update the ReplicaSet
	rs.Labels["hello"] = "world"
	err = r.client.Update(ctx, rs)
	if err != nil {
		return reconcile.Result{}, fmt.Errorf("could not write ReplicaSet: %+v", err)
	}

	return reconcile.Result{}, nil
}
```

## read the sacred texts

Before you dive into building your own controllers though, do yourself a favor and spend some quality time with the Kubebuilder book ([https://book.kubebuilder.io/](https://book.kubebuilder.io/)). Understanding how Kubernetes expects APIs to behave will save you countless hours of headaches down the road.
It'll also set you up well for writing CRDs and generating their specs from go types.

Second, SIG Architecture has laid out some seriously well-thought-out conventions in their [API guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties). I constantly find myself referring to these guidelines, especially for things like exposing meaningful statuses and conditions.
These aren't just suggestions - they're the difference between your controller playing nice with the ecosystem and it being that one weird implementation that makes everyone's lives harder. Take it from someone who's had to refactor controllers because they didn't align with these patterns: invest the time upfront to understand how status conditions should work, what fields belong in spec versus status, and how to structure your CRDs properly.

Following these conventions will make sure your controller behaves how users expect it to. While your controller can be "technically correct" or "built to spec", it's a lot better of an experience for users when it has clear side effects, integrates well with existing tooling, and provides meaningful information about what its doing.

## level-triggered vs. edge-triggered design

Let's talk about one of the most important design principles in Kubernetes controllers: level-triggered behavior. If you're coming from a background in systems programming, you might be familiar with these terms from event notification systems like [epoll](https://en.wikipedia.org/wiki/Epoll). If not, don't worry - I'll break it down.

Edge-triggered systems react to changes (the "edges" between states). Think of it like a motion sensor light - it only triggers when it detects movement. Level-triggered systems, on the other hand, continuously check the current state against the desired state. This is more like the thermostat example from the last blog (and k8s docs) that's constantly checking if the room temperature matches what you've set.

Kubernetes controllers are designed to be level-triggered, and this is absolutely crucial. Here's why:

```go
// Edge-triggered (swat! bad, no!)
func (r *Reconciler) Reconcile(ctx context.Context, req reconcile.Request) (reconcile.Result, error) {
    var myResource myv1.MyResource
    if err := r.client.Get(ctx, req.NamespacedName, &myResource); err != nil {
        return reconcile.Result{}, err
    }
    
    // Only react to specific changes
    if myResource.Generation != myResource.Status.ObservedGeneration {
        // Handle the change
        return r.handleSpecChange(&myResource)
    }
    
    // Otherwise do nothing
    return reconcile.Result{}, nil
}

// Level-triggered (yes... good, good)
func (r *Reconciler) Reconcile(ctx context.Context, req reconcile.Request) (reconcile.Result, error) {
    var myResource myv1.MyResource
    if err := r.client.Get(ctx, req.NamespacedName, &myResource); err != nil {
        return reconcile.Result{}, err
    }
    
    // Always check everything
    current := r.gatherCurrentState(ctx, &myResource)
    desired := r.calculateDesiredState(&myResource)
    
    // Make any needed changes to align current with desired
    return r.reconcileState(ctx, &myResource, current, desired)
}
```

The edge-triggered approach might seem more efficient at first glance. Why do work if nothing's changed, right? But this thinking can lead to some nasty failure modes:

What if your controller crashes while processing a change? Without checking the full state each time, you might miss that the work wasn't completed.

What if an external agent (like an angry engineer just trying to get their thing to work with kubectl) modifies a resource your controller manages? If you're only watching for specific changes, you might miss these modifications entirely.

What if the Watch connection to the API server hiccups and you miss some events (more on this later)? With an edge-triggered approach, you're now out of sync and might not catch up.

A level-triggered approach means our controller is resilient to all sorts of failures - missed events, external changes, partial failures during reconciliation, you name it. Each reconciliation loop is a fresh chance to make things right.

The Watch API is still important - it's how we know when to check things quickly rather than waiting for our periodic reconciliation. But we never assume that the watch events tell us everything we need to know about what's changed. They're more like helpful hints about when to look, not authoritative statements about what's different.

This pattern of "calculate desired state, check current state, fix differences" is fundamental to how Kubernetes itself works. It's what makes the system so resilient to failures and so good at self-healing. When you're building your own controllers, embrace this pattern. Your future self (and your on-call rotation) will thank you.

## breaking down the reconciliation loop

Now let's assume you've taken my advice, are using `controller-runtime`, did the recommended reading, and understand level-triggered design. You've gotten setup out of the way and now need to build your functionality into the controller. 

As you saw above, with `controller-runtime` you're given an entrypoint in the `Reconcile` method. This is kicked off by the [Watch API](https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes), which gives you a stream of events for resources you care about (you can do all objects of kind X, only those matching certain labels, up to you).
An important callout here is that you can't trust that you'll see every event. Watches can disconnect, events can be missed, and sometimes the API server may just kick your watch and restart it. This is what makes the reconciliation loop so important. You're not just handling events as they come in - you're responsible for ensuring the entire state is correct **every time you reconcile the resource**. 

Here's how you should think about reconciliation:
```go
func (r *Reconciler) Reconcile(ctx context.Context, req reconcile.Request) (reconcile.Result, error) {
    log := log.FromContext(ctx)
    
    // 1. Get your resource.
    var myResource myv1.MyResource
    if err := r.client.Get(ctx, req.NamespacedName, &myResource); err != nil {
        return r.handleGetError(err)
    }

    // 2. Check if we're deleted/being deleted
    if !myResource.DeletionTimestamp.IsZero() {
	    if controllerutil.ContainsFinalizer(&myResource, myFinalizerName) {
		    // Run any necessary cleanup logic.
		    if err := r.cleanupExternalResources(ctx, &myResource); err != nil {
			    return reconcile.Result{}, fmt.Errorf("cleanup failed: %w", err)
		    }
	    }
	    // Remove our finalizer to allow deletion to continue.
	    controllerutil.RemoveFinalizer(&myResource, myFinalizerName)
	    if err := r.client.Update(ctx, &myResource); err != nil {
		    return reconcile.Result{}, fmt.Errorf("finalizer removal failed: %w", err)
	    }
	    // Thing's been deleted, nothing to do.
	    // (Or you can add additional logic here)
	    return reconcile.Result{}, nil
    }
    
    // 3. Ensure our finalizer is present for active resources.
    if err := r.ensureFinalizer(ctx, &myResource); err != nil {
        return reconcile.Result{}, fmt.Errorf("ensuring finalizer failed: %w", err)
    }
    
    // 4. Validate current state.
    if err := r.validateResource(&myResource); err != nil {
        return r.handleValidationError(ctx, &myResource, err)
    }
    
    // 5. Check dependent resources if your resource manages other resources.
    dependentResources, err := r.gatherDependentResources(ctx, &myResource)
    if err != nil {
        return reconcile.Result{}, fmt.Errorf("gathering dependent resources failed: %w", err)
    }
    
    // 6. Determine what needs to change.
    changes := r.determineRequiredChanges(&myResource, dependentResources)
    
    // 7. Apply changes.
    if err := r.applyChanges(ctx, &myResource, changes); err != nil {
        return r.handleChangeError(ctx, err)
    }
    
    // 8. Update status.
    if err := r.updateStatus(ctx, &myResource, dependentResources); err != nil {
        return reconcile.Result{}, fmt.Errorf("updating status failed: %w", err)
    }
    
    // 9. Schedule next reconciliation if needed.
    return r.determineNextReconcile(&myResource)
}
```

There's a lot to unpack here, let's go through it. 

### resource ownership
One of the most fundamental patterns in Kubernetes controllers is resource [ownership](https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/). When your controller creates resources on behalf of your custom resource (like ConfigMaps, Secrets, or even Pods), you need to establish proper ownership relationships. This isn't just about being organized - it's about enabling Kubernetes' garbage collection to work properly.

If your resource creates ConfigMaps for example, you'll end up setting ControllerReferences:
```go
func (r *Reconciler) createConfigMap(ctx context.Context, owner *myv1.MyResource, name string, data map[string]string) error {
    configMap := &corev1.ConfigMap{
        ObjectMeta: metav1.ObjectMeta{
            Name:      name,
            Namespace: owner.Namespace,
        },
        Data: data,
    }
    
    // This is crucial - it sets up the owner reference.
    if err := controllerutil.SetControllerReference(owner, configMap, r.scheme); err != nil {
        return fmt.Errorf("setting controller reference: %w", err)
    }
    
    // Create with a retry in case of conflicts.
    return retry.RetryOnConflict(retry.DefaultRetry, func() error {
        err := r.client.Create(ctx, configMap)
        if err != nil && !apierrors.IsAlreadyExists(err) {
            return err
        }
        return nil
    })
}
```

Now you've set up a relationship where `MyResource --owns--> ConfigMap`.
Make sure you're thinking through what could happen with the lifecycle of these resources: 
1. What happens if a child resource is manually deleted? If you expect it to always be there you may introduce a panic.
2. What order should resources be created in? This was important when I worked on something that replicated Helm.
3. How do you handle partial creation scenarios? If some of your resources get created but others fail, do you have to tear-down and retry?

When managing dependent resources, you should consider collecting failures and surfacing them as reconciliation failures via your owner resources' Conditions so downstream users can see the failures. Logs may be great for you, but Kubernetes Events and Conditions are great for you AND your users :) 

That brings me to my next point.

### state tracking and status updates

Status updates are how your controller communicates with the outside world. They're not just about setting a "Ready" condition - they're about providing meaningful information about the state of your resource and its dependencies.
*Note: PLEASE take the advice of the api-guidelines from the SIG and DO NOT EXPOSE YOUR NOTION OF AN FSM though an Enum. It's oftentimes more confusing than it is helpful.*

For an example Resource that manages the deployment of a workload, consider condition Types like the following:
```go
// Better condition types that follow API conventions
const (
    // ConditionTypeResourcesAvailable indicates whether all required dependent resources 
    // exist and are functioning correctly.
    ConditionTypeResourcesAvailable string = "ResourcesAvailable"
    
    // ConditionTypeConfigurationReady indicates whether the resource's configuration has been 
    // applied successfully.
    ConditionTypeConfigurationReady string = "ConfigurationReady"
    
    // ConditionTypeWorkloadHealthy indicates whether the managed workload is operating within
    // expected parameters
    ConditionTypeWorkloadHealthy string = "WorkloadHealthy"
    
    // ConditionTypeReady summarizes the overall operational status of the resource.
    ConditionTypeReady string = "Ready"
)
```

With these conditions (combined with explanatory reasons + messages), users would be well-informed of the status of dependent resources, the workload, and the manager object itself. 
The condition types have observable states, clear polarity, and include a summary condition that attempts provides a good rollup of any failures.

### resource version handling - conflict resolution

Every Kubernetes object has a [resource version](https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes), and it changes every time the object is modified. This is crucial for implementing optimistic concurrency control. When you update a resource, make sure you pull the latest version of the resource and apply your changes WITHIN the `retry.RetryOnConflict` function.

Here's an example:
```go
func (r *Reconciler) updateResource(ctx context.Context, resource *myv1.MyResource, update func(*myv1.MyResource)) error {
    return retry.RetryOnConflict(retry.DefaultRetry, func() error {
        // Get the latest version.
        fresh := &myv1.MyResource{}
        if err := r.client.Get(ctx, client.ObjectKeyFromObject(resource), fresh); err != nil {
            return fmt.Errorf("getting fresh resource failed: %w", err)
        }
        
        // Apply our changes to the fresh copy.
        update(fresh)
        
        // Try to update.
        if err := r.client.Update(ctx, fresh); err != nil {
            return err
        }
        
        // Update our local copy if needed.
        *resource = *fresh
        return nil
    })
}
```

### finalizers - wake me up before you go go

Finalizers are one of those Kubernetes features that seem simple at first glance but have some fascinating complexity under the hood. They're like the close door button in an elevator - they don't make the deletion happen faster, but they ensure it happens safely.

When you add a finalizer to a resource, you're essentially telling Kubernetes "hold up, don't delete this yet - I need to clean some things up first." This is crucial when your controller manages resources that exist outside the Kubernetes cluster (like cloud resources) or when you need to ensure proper cleanup of dependent resources.

Here's how the deletion process actually works:

1. A user or system requests deletion of a resource
2. Kubernetes checks for finalizers
3. If finalizers exist:
    - Sets deletion timestamp
    - Keeps resource around in "terminating" state
4. Controllers see deletion timestamp, perform cleanup
5. Controllers remove their finalizers
6. Once all finalizers are gone, Kubernetes deletes the resource

(If you've ever tried to delete a namespace and it gets stuck, you're *probably* running into a finalizer issue)

Let's look at a sample finalizer implementation:

```go
const finalizerName = "awesomecontroller.tdoot.com/cleanup"

func (r *Reconciler) ensureFinalizer(ctx context.Context, resource *myv1.MyResource) error {
    if !controllerutil.ContainsFinalizer(resource, finalizerName) {
        controllerutil.AddFinalizer(resource, finalizerName)
        return r.client.Update(ctx, resource)
    }
    return nil
}

func (r *Reconciler) handleDeletion(ctx context.Context, resource *myv1.MyResource) (reconcile.Result, error) {
    if !controllerutil.ContainsFinalizer(resource, finalizerName) {
        return reconcile.Result{}, nil
    }
    
    // Clean up external resources.
    if err := r.cleanupExternalResources(ctx, resource); err != nil {
        // If cleanup fails, we keep the finalizer and retry
        return reconcile.Result{RequeueAfter: time.Minute}, fmt.Errorf("cleanup failed: %w", err)
    }
    
    // Remove our finalizer.
    controllerutil.RemoveFinalizer(resource, finalizerName)
    if err := r.client.Update(ctx, resource); err != nil {
        return reconcile.Result{}, fmt.Errorf("removing finalizer failed: %w", err)
    }
    
    return reconcile.Result{}, nil
}
```

### rate limiting - cool off

Rate limiting in controllers is more complex than just adding some simple delays. We need to handle multiple types of rate limiting:

1. Workqueue rate limiting for individual resources
2. Overall controller throughput
3. API server request limiting
4. External API rate limiting

Number 3 brings up a not-so-fond memory of working with a very popular CD tool with a less mature Kubernetes API gateway. It generated so many requests against the API server that we'd effectively lock ourselves out of deploying anything when we hit rate limits. Our deployments would break and because of the rate limits we couldn't even fix them.

When you look to implement rate-limiting in your controller, check out `workqueue.RateLimiter` from the `client-go` package. 
[Here's ](https://github.com/kubernetes/client-go/blob/master/examples/workqueue/main.go#L171)an example in their codebase.

### deep copy - don't double dip the chip

Deep copying in controllers is about more than just avoiding mutations - it's about handling concurrent access to objects correctly. The client-go cache is shared across all controllers, so we need to be extremely careful about modifications.

```go

func (r *Reconciler) Reconcile(ctx context.Context, req reconcile.Request) (reconcile.Result, error) {
    // Get from API server
    var original myv1.MyResource
    if err := r.client.Get(ctx, req.NamespacedName, &original); err != nil {
        return reconcile.Result{}, client.IgnoreNotFound(err)
    }
    
    // ALWAYS work with a copy for modifications.
    resource := original.DeepCopy()
    
	// Do whatever ...

	// Fetch a fresh copy when you try to apply.
    return retry.RetryOnConflict(retry.DefaultRetry, func() error {
        // Get latest version
        var latest myv1.MyResource
        if err := r.client.Get(ctx, req.NamespacedName, &latest); err != nil {
            return err
        }
        
        // Apply our changes to the fresh copy
        latest.Spec = resource.Spec
        
        // Try to update
        return r.client.Update(ctx, &latest)
    })
}
```

This attention to copying isn't just about correctness - it's about preventing subtle bugs that only show up under load or in production environments. The extra allocations from copying are almost always worth it compared to the cost of debugging race conditions or cache corruption.

## wrapping it all up - build with the pager in mind

A properly built controller needs to be resilient to network issues, API server restarts, and engineers who use `kubectl edit` where they shouldn't.

For your own sake, remember to:

- Always think level-triggered, not edge-triggered. Your controller should be able to jump in at any point and figure out what needs to be done.
- Treat the API server's watch events as helpful hints, not as the single source of truth. Always verify the current state before making changes.
- Use finalizers religiously, but make sure to not hang! They're your safety net for cleaning up resources, especially anything outside the cluster.
- Handle rate limiting at multiple levels. Your controller isn't the only thing running in the cluster, so play nice with others.
- Copy objects like your production stability depends on it (because it does).
- Status conditions aren't just for show - they're how your controller communicates with the rest of the world.

Most importantly, remember that controllers are part of the control plane of your cluster. They need to be more reliable than the workloads they're managing. Every panic is a potential outage, every race condition is a ticking time bomb, and every unhandled edge case is a future incident waiting to happen.