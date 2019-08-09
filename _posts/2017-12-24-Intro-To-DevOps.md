---
layout: post
title: Intro To (some) Common DevOps/SRE Tooling and Ideologies
date: 2017-12-24 11:28
tag:
- DevOps
- Site Reliability Engineering
- Packer
category: blog
author: tony
description: My personal notes taken in preparation for starting a position as an SRE. I plan to periodically update these notes to cover more tools and best practices.

---

# DevOps Notes

My personal notes taken in preparation for starting a position as an SRE.
I plan to periodically update these notes to cover more tools and best practices.

### Resources:

- [The Phoenix Project](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592)
- [Site Reliability Engineering](https://landing.google.com/sre/book.html)
- [The DevOps Handbook](http://itrevolution.com/devops-handbook)
- Udacity's [Intro to DevOps](https://www.udacity.com/course/intro-to-devops--ud611)
- [Building a DevOps Culture](https://smile.amazon.com/gp/product/B00CBM1WFC)
- [Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley-ebook/dp/B003YMNVC0)
- [Chef-Style DevOps](https://www.youtube.com/watch?v=_DEToXsgrPc)

## What is DevOps?

Defined by the people at Chef - "A cultural and professional movement, focused on how we build and operate high velocity organizations, born from the experiences of its practitioners."

### Where does DevOps fit in?
Agile development usually fits into the process of planning->coding->testing. Once feedback is generated from the test, the plan and/or code is refactored, then tested again. Various tests could be unit testing, integration testing, user acceptance testing, etc.

We can improve on the agile model by introducing automated build and unit tests (continuous integration), which results in a loop between connecting code and testing. The automation process helps with the iterative development process and ensures that new features will not break existing functionality. We can then automate the process all the way through the delivery phase (test->release->deploy) - this is the idea of continous delivery. Throw some monitoring in the mix to check on the deployments and alter when needed, and we've come up with our model for devops.

### Solving the problem of different development environments
Use a unified production and development environment (golden image). Take operating systems, libraries, operating system, and wrap them up into a standard, golden image virtual machine. Can be used both on desktops as a VM or on servers.

You can also use a configurating management system that performs automatic installation, configuration and updating of dependencies on every machine in its control.

Which should I choose?
**Golden Image**:
- More work up front
- Large install image must be regenerated for any change
	- Much faster installation/boot
	- Immutable image

**Configuration Management**:
- Lighter build process
	- Integration done at install/initial boot time
- Slower startup process
- Easy to update
We can also combine these approaches!

## [Packer](https://www.packer.io)
Packer automates the creation of any type of machine image. You can use automated scripts to install and configure the software within your Packer-made images. With Packer you can create identical machine images for multiple platforms from a single source config. Packer works alongside tools like Chef or Puppet to install software onto the image.

A **machine image** is a single static unit that contains a pre-configured operating system and installed software which is used to quickly create new running machines.

### Why use packer? (From Packer [Docs](https://www.packer.io/intro/why.html))
- **Fast infrastructure deployment**: Packer images allow you to launch completely provisioned and configured machines in seconds. Dev VMs can also be launched in seconds.
- **Multi-provider portability**: Since Packer creates identical images for multiple platforms, you can run prod, staging/QA, and dev environments all on an identical machine image.
- **Improved Stability**: Packer installs and configures all software for a machine at the time the image is built. Bugs in install scripts are caught early, not after the machine is launched.
- **Greater Testability**: After a machine image is built, the machine can be launched and smoke tested to verify that things appear to be working.

You can use Packer in the middle of your continuous delivery pipeline, to maintain consistent work environments, and to create appliances and demos.

### Packer Templates
Packer templates are configuration files (JSON) used to define what image we want built and how.
**Builders** take a source image that is different for each specific builder. Some builders take ISOs, AMIs; the source image type depends on the type of builder.

**Provisioners** install and configure software within a machine prior to that machine becoming a static image. Provisioners include shell scripts, Puppet scripts.

**Post-processors** take the result of a builder or another post-processor and process that new artifact. You can compress, upload, build a vagrant box, etc. Every builder produces a single artifact.

### Overview
Working through a template file:
- For each *builder* Packer will run a build to produce an image.
- When the machine is up and running on that image, Packer will run provisioners to install and configure software. That is saved as a **modified image**.
- When that is done, optional post-processors are combined with the modified image to create a *final artifact*.

**Example:**
*Q:* How would you switch from Ubuntu to CentOS in Packer?
*A:* Change the **source** in the **builder** configuration.

### Practice Project ([GitHub Source](https://github.com/udacity/devops-intro-project))
*Commands to get the webapp running fo the Udacity practice project. If you're not doing the Udacity course linked above, ignore this. I strongly suggest taking a look at this project if you haven't generated machines with Packer*

Packer commands: 

Build an image for virtualbox using the application-server.json template
$ packer build -only=virtualbox-iso application-server.json
$ cd virtualbox
Add the image to your vagrant VMs. 
$ vagrant box add ubuntu-14.04.5-server-amd64-appserver_virtualbox.box --name devops-appserver
Bring up the dev environment
$ vagrant up
Connect to the server
$ vagrant ssh

You don't need any special access keys when you are building images for use on a local machine with VirtualBox/Vagrant. 

Once ssh'd into the server, clone and run the webapp. 
(Local Machine) go to root of cloned repo
git clone https://github.com/chef/devops-kungfu.git devops-kungfu
(VM) Install all app dependencies and run grunt tests
$ cd devops-kungfu
$ npm install
$ grunt -v

Use Google Cloud Platform (Compute Engine) to build the image in the cloud. You must enable Cloud Engine API and generate keys!

Once this is all set up, we're running the same environment on both development (local) and prod (cloud)!

## Development and Production Environments
Environments you may have: 

- Local environment (dev machine)
- Development environment (deploy branches of code)
- Integration environment (CI build target or test side effects, changes are merged)
- Testing environment
- Staging area (mirror of production)
- Production 

### From Dev to Production
Use version control systems to track changes and keep them in sync. 

Workflow to push from dev to prod: 
writing code -> local tests -> larger tests -> code review -> commit to main branch -> integration + more tests -> staging -> even more tests -> change is live in production

Best Practices for maintaining good releases: 

- Maintain a code repository
- Automate the build
- Test the build
- Commit your changes often
- Build each commit 
- Fix bugs right away
- Test from clone of production environment

Continuous Integration Products (running compiler and test suite): 

- Jenkins (OS, written in Java, self-hosted)
- Travis CI (hosted)
- Circle CI (hosted)

CI watches repo for new commits - on commit, spawns a new build process which runs and builds data files, compiled binaries. Then the CI system spawns tests that are run on the built artifacts. 

Image from the practice project above (control-server.json) includes Jenkins.
To build the image for googlecompute we run the command: 
$ packer build -only=googlecompute control-server.json

The image now appears in the Compute Engine dashboard, then we can launch a new server instance with this image. Find external IP then go to IP/jenkins

### Jenkins
Jenkins allows you to automate many different tasks related to building, testing, and delivering or deploying software. You can install various plugins to leverage different functionality such as GitHub commits, pull-requests, etc.

From a Jenkins configuration we can determine how often we want to run a job, if we only want to build on a stable release, what commands we want to execute, and many other options. 

Jenkins also provides console output for all builds. This logging for each compilation allows us to determine where a build went wrong.


## Testing and Monitoring
**Unit Testing:** tests written alongside code, to test the behavior of individual units such as functions or classes. (Makes sure code is working as built)

**Regression Testing:** tests written as part of debugging, which verify that a bug is fixed. Kept in the test suite to ensure the bug is not reintroduced. (Keeps from making same bug twice)

**Smoke Testing:** preliminary test of a system just after build, to make sure it runs at all - for instance, doesn't crash on boot. (Keeps broken builds out of test pipeline. "Build verification" test)

**System Integration Testing:** Tests of a whole system, including dependencies such as databases or APIs, under a test load. 

**Automated Acceptance Testing:** scripted tests that verify that user-facing features work as planned. 

**Manual QA Testing:** Approval process integrated with continuous delivery

Keep track of code bugs and production problems in a shared bug tracking system (like JIRA!)

**Monitoring Data Sources:**

- External probing, test queries
- Application-level stats 
	- queries per second, latency
- Environment stats
	- JVM memory profile
- Host/container stats
	- load average, disk errors

**Monitoring Data Products:**
- Alerting
- Performance analysis
- Capacity prediction
- Growth measurement
- Debugging metrics











