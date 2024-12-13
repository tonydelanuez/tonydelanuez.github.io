---
title: "kubernetes controllers explained - how your cluster stays in line"
date: 2024-12-13T15:39:45-06:00
author: "Tony"
tags: ['kubernetes']
categories: ['blog']
draft: false
---

Controllers aren't just add-ons to Kubernetes - they're fundamental to how the whole system works. They're the caretakers of your cluster, overseeing and orchestrating processes to ensure your defined resources stay on track. Whether it's [maintaining pod replicas](https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/replicaset/replica_set.go), [managing rolling updates](https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/deployment/deployment_controller.go), or [handling node lifecycles](https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/nodelifecycle/node_lifecycle_controller.go), controllers are there making sure things run smoothly.

The [Kubernetes documentation](https://kubernetes.io/docs/concepts/architecture/controller/) explains their job as follows:
> In Kubernetes, controllers are control loops that watch the state of your [cluster](https://kubernetes.io/docs/reference/glossary/?all=true#term-cluster), then make or request changes where needed. Each controller tries to move the current cluster state closer to the desired state.

So what does this mean for you? As a user of Kubernetes - whether you're deploying a simple app or managing a complex microservices architecture - it means you don't have to worry about micromanaging every single piece of infrastructure. Imagine a world where you're manually scaling up pod counts, provisioning network endpoints, or restarting a set of pods that somehow always manages to fail.

*Note: I realize this isn't a hard thing to imagine, this was "Operations" before we had container orchestrators, but you get what I mean.*

With controllers, your interaction with Kubernetes boils down to performing CRUD (create, read, update, and delete) operations on [objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/) like pods, deployments, or services. Once you've declared the desired state of these resources (by setting their spec), controllers take over to handle everything else. They do the dirty work of *reconciling* differences between the desired and actual state, manage failures, and optimize resource allocation, letting you focus solely on defining what you need rather than how to implement it.
### Reconciliation

That word "reconciling" isn't just a fancy way of saying "fixing differences." It's actually a fundamental concept in Kubernetes that powers everything from self-healing to scaling. Let me dive into why this reconciliation pattern is actually one of the coolest parts of how Kubernetes works. Think of it like having the world's most attentive DevOps engineer – one who never sleeps, never gets distracted, and is laser-focused on keeping your system exactly the way you specified.

When you create a deployment with 3 replicas, you're setting a *desired state*. The controller doesn't just start up those pods and walk away - it's constantly monitoring and adjusting. Just like a thermostat notices "It's 72°F but we want 70°F," the controller checks "We need 3 replicas... only 2 running? Let me start another one."

This constant vigilance is what makes Kubernetes so reliable. If a pod crashes? The controller notices and starts a replacement. Node goes down? The controller moves those workloads somewhere else. Someone accidentally scaled your deployment to 100 replicas? Just set the desired number back to 3, and the controller smoothly brings your system back to where it should be - just like how your thermostat gradually brings your room back to the right temperature when someone gets a little ambitious with the Nest.

The heart of every Kubernetes controller is essentially this endless loop of checking and fixing. Here's what it looks like in its simplest form:

```
def run():
    while True:  # The controller never stops running
        desired := getDesiredState()    # What you declared in your YAML
        actual := getCurrentState()     # What's actually running in the cluster
        makeChanges(desired, actual)    # Fix any differences found
```

Next time we'll dive into controller implementation, looking at how to build your own controllers and exploring some of the more complex patterns that make them tick.