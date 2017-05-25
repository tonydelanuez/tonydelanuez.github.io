---
layout: post
title: Deploying on Docker
date: 2017-05-21 19:23
tag:
- Docker
- DevOps
- Containers

category: blog
author: tony
description: In this post I explain the basics of Docker and why it may be of use to you as a developer or system admin.  

---
The school year is over and I get to just work on development projects and writing before I head to work. This will be the first of what I hope will be many blog posts I release this summer. 

# Deploying on Docker

### What is Docker?
![Docker Logo](http://zazuapp.org/images/package-icons/docker.png)
Docker allows developers and system administrators to deploy their applications on any server/instance type running Docker without worrying whether the app will work or not, using a cool thing called a container. 

Before we get started, here are some key terms that may help you understand the rest of the post. 

### Key Terms

From Docker's Docs: 
*Container*: a container is a runtime instance of an image - what the image becomes in memory when actually executed. It runs completely isolated from the host environment by default, only accessing host files and ports if configured to do so. 

*Dockerfile*: the Dockerfile defines what goes on in the environment inside your container. Access to resources like networking interfaces and disk drives is virtualized inside this environment, which is isolated from the rest of your system, so you have to map ports to the outside world, and be specific about what files you want to "copy in" to that environment. 

*Image*: an image is a lightweight, stand-alone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and config files. 

*Service*: a service defines how the containers behave in production - what ports it should use, how many replicas of the container should run so the service has the capacity it needs, and so on. 

*Stack*: the stack determines how all the services are run. 

*Swarm*: a swarm is a group of machines that are running Docker and have been joined into a cluster. After that has happened, you continue to run the Docker commands you’re used to, but now they are executed on a cluster by a swarm manager. The machines in a swarm can be physical or virtual. After joining a swarm, they are referred to as nodes.

*Workers*: workers in a swarm are just there to provide capacity and do not have the authority to tell any other machine what it can and can’t do.

### How Does a Container Work? 

So with those terms defined, we're ready to look more closely at images.  From above, an image is a package of software that comes with basically everything you need to run it. This includes, but is not limited to: 

* Code
* Runtime 
* System Tools
* System Libraries
* Settings
* Outside Dependencies


![Container vs VM](https://www.sdxcentral.com/wp-content/uploads/2016/01/containers-versus-virtual-machines-docker-inc-rightscale.jpg)


What this means is that when you run this container image on another computer, you're fundamentally running it in exactly the same environment every time. Thus, we say the program is "contained". We've created a portable container that we can now move to different host machines and still get the same results because our environment doesn't appear to change to the code and vice versa. 

Take this example from the Docker docs. 

"In the past, if you were to start writing a Python app, your first order of business was to install a Python runtime onto your machine. But, that creates a situation where the environment on your machine has to be just so in order for your app to run as expected; ditto for the server that runs your app.

With Docker, you can just grab a portable Python runtime as an image, no installation necessary. Then, your build can include the base Python image right alongside your app code, ensuring that your app, its dependencies, and the runtime, all travel together."

### How About a Metaphor?
One way I like to think of this is if my friend asked me to come game at his place because he has a free desk. 
The desk will be our new host machine. 

Now I could use his old laptop, or I could bring my desktop, monitor, keyboard, and mouse to my buddy's house in order to play. Ignore the cost of moving all my hardware. 

His old laptop is Windows so it "should" work, but maybe the correct video drivers aren't installed or even worse - the laptop is running Windows 98 and I need Windows 7/8/10. Docker fundamentally allows you to pack up your work environment and replicate it on another machine, so you don't have to worry about your buddy's laptop being so bad! You just bring your setup with you (host it in a repository and clone it wherever you go) then plug and play!

### Benefits of Using Docker
Deploying your application with Docker provides a few significant benefits: 
1. It's simple! 
Once you get Docker up and running locally and on your host machine, your deployments will be fast, easy, and extremely portable. You'll be able to run your app on any configuration as long as Docker is supported on the machine.  

2. Quick Deployment
I mentioned this above, but deploying on Docker is extremely easy. Instead of running a bunch of different scripts to get your dependencies installed, check versions, do updating, etc., all you have to do is load your container image into Docker and get going. 
Docker does not boot an OS, so you can simply spin up a Digital Ocean instance with Docker pre-loaded and get going right away. 

3. Easy Load Balancing
You can deploy web services to multiple Docker container then perform load balancing between them using a proxy or load balancer. You can also configure Docker to restart any of your containers on a fail. 

Docker containers can be faster and more less resource heavy than virtual machines so long as the user is willing to stick to a single platform to provide a shared operating system (3). 

### How Do I Move Docker Images? 
You can store your Docker images on Docker's cloud *registry* which operates similar to GitHub/BitBucket/etc.

From Docker's Get Started Tutorial:
"A registry is a collection of repositories, and a repository is a collection of images - sort of like a GitHub repository, except the code is already built. An account on a registry can create many repositories. The docker CLI is preconfigured to use Docker's public registry by default." (4)

This option allows you to create and share private image repositories with your team or you can opt to make them public for use within the entire community. 

You can also save docker images to tar files locally and move those about however you'd like. 


### Okay, Take me to the Tutorial!
Docker's tutorial located [here](https://docs.docker.com/get-started) is a wonderful starting point for people new to Docker.
It's a six part tutorial that'll teach you the basics of Docker, containers, services, swarms, stacks, and how to deploy your app. Go ahead and get started!


## Sources: 

1. [DevOps.com: Docker vs VMs](https://devops.com/docker-vs-vms/)
2. [StackOverflow: How is Docker different from a normal virtual machine?](http://stackoverflow.com/questions/16047306/how-is-docker-different-from-a-normal-virtual-machine)
3. [Docker Blog: So, When do you Use a Container or VM?](https://blog.docker.com/2016/05/vm-or-containers/)
4. [Docker: Get Started](https://docs.docker.com/get-started/)


Thanks for reading. 



___ 

Hopefully this post has helped you in some way. If you'd like more resources on the subject or would like clarification, feel free to post a comment below. 

-Tony












