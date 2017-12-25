---
layout: post
title: Intro To DevOps
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
