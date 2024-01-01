---
title: "doing k8s on the cheap - my \"new\" homelab"
date: 2023-12-31T18:11:22-05:00
draft: false
author: "Tony"
tags: ['tech', 'kubernetes']
categories: ['blog']
---

Most SRE-aligned engineers will tell you they have a home lab. Depending on how grey the beard is, it may be an old blade they acquired when a company moved data centers, an intricate setup of Raspberry Pi 4s set up in a custom cooling rack, or like me and many others, it may just be an old gaming computer they no longer use but cannot bring themselves to get rid of. Whatever it may be, it's usually used for learning, tinkering, or to run some of the [/r/selfhosted](https://reddit.com/r/selfhosted) favorites.

For the last two months or so I've been hacking on projects related to Magic the Gathering and have been running them on various public cloud free trials. Alas, those days have come to an end. My finally expiring DigitalOcean credits and a looming $72 credit card charge have forced me to dust off the old [mini-ITX](https://pcpartpicker.com/product/LvnG3C/fractal-design-case-fdcacore500bk) gaming rig. It's the one I schlepped around in a Nike duffle bag back and forth from St. Louis to CA for three years during semesterly flights to grad school and back.

Long gone are the days of playing League of Legends or Hearthstone late into the night on this badboy. Years ago it met its forever home when I shoved it into a cigarette-smoke stained retro TV I bought off of Facebook marketplace from two folks who were seemingly running a nursery out of their tiny apartment here in Austin.  I was originally going to retrofit the TV into a dry bar, then while removing some of the (non-working) internals I remembered a wet bar was fantastically useless to someone who doesn't drink. Now it holds my [router](https://www.bhphotovideo.com/c/product/1519029-REG/ubiquiti_networks_udm_us_unifi_dream_machine.html/overview?ap=y&ap=y&smp=y&smp=y&lsft=BI%3A5451&gad_source=1&gclid=Cj0KCQiAv8SsBhC7ARIsALIkVT3kxaLn9E22_aENHzBoRC35hKKIcNglzkvx7AU3Hyc2M_mOE1rsf40aAiU2EALw_wcB).

![my retro tv](/images/pictures/retro-tv.jpg)

Anyways, onto the lab setup.

I spend a significant portion of my time at work focusing on Kubernetes strategy and security for an extensive GCP environment. Therefore, one of my primary goals here was to create a multi-machine (not just VM) Kubernetes cluster that would force me to be mindful about how and where I schedule workloads. However, Kubernetes can be prohibitively expensive to run, so I also aimed for a low-cost solution. Opting to use VMs from multiple cloud providers allowed me to assemble a 'real-life' k8s deployment. 
My previous setups, involving `kind` on multiple 'nodes' running as Docker images and k3s with Vagrant VMs, always felt somewhat lacking in complexity and weren't fault-tolerant enough for running actual workloads. Living in Texas, where power outages flow like queso, made it crucial for me to have a setup that wasn't just running locally under my desk.

### Compute

My current setup is comprised of: 
- Homelab server (quad core, 16GB RAM machine with **sick** flame stickers on the side for extra power)
* (three) OCI VMs (will be a fourth once OCI finally approves my long-waiting account upgrade)
	* (one) 2 OCPU / 12 GB RAM Ubuntu 22.04 ARM 64 instance (A1.Flex)
	* (two) 1 OCPU / 1GB RAM Ubuntu 22.04 AMD instances
* (one) GCP 2 vCPU / 1GB RAM Ubuntu 22.04 e2-micro Intel instance

The OCI and GCP instances all fit within their free tiers. While the OCI dashboard is somehow still stuck in 2015, their [free tier](https://www.oracle.com/cloud/free/) is bonkers.

I've joined these machines together into a Kubernetes cluster with k3s, creating a compute environment not unlike the[ 2001 set of Toa Mata Bionicles](https://bionicle.fandom.com/wiki/Toa_Mata/Toa_Nuva) that I'd rearranged as a child into a plastic abomination of arms and legs. 

![2001 set of bionicles](/images/pictures/bionicles.webp)

(Picture credit to All Out Brick, mine are long gone)
https://alloutbrick.com/blogs/blog/review-official-set-2001-bionicle-toa-mata

### Networking

On a recent trip to Mexico I started messing with [Tailscale](https://tailscale.com/) because I wanted to code on my iPad using code-server on a VPS as a way to run a lightweight version of VSCode on my laptop and wanted a smoother networking experience. 

*Disclaimer: Even though Tailscale is amazing, coding on an iPad is still awful.*

Tailscale let me set up a [mesh network](https://tailscale.com/blog/how-tailscale-works) between all of my devices, no matter where they're located. It also takes like two minutes to set up. Wild. After a few minutes I'd joined each machine into my Tailnet, making them easily reachable from all my personal devices,  then used the [Tailscale VPN provider in k3s](https://docs.k3s.io/installation/network-options#integration-with-the-tailscale-vpn-provider-experimental) to join each machine to the cluster.

![rough diagram of setup](/images/pictures/k8s-homelab.jpg)

It's important to note that by default this will lock your setup to traffic **only** on the Tailscale network - this was not what I wanted as I'm running a hobby app [Decked](https://app.decked.gg) on the cluster. To make the k8s master available to the internet, make sure you set the `--advertise-address` and `--node-external-ip` to the external/public IP of the node or else you'll be forever stuck in Tailscale land. This tripped me up for way longer than I'd care to admit.

k3s comes with [traefik](https://traefik.io/traefik/) installed by default as a system service so in order to get some services publicly (and securely) available on the internet all I had to do was set up [cert-manager](https://cert-manager.io/) for certificates and Cloudflare as my CDN / load balancer and create an Ingress for the Service to make it reachable from outside the cluster. 

This setup has been fun to work on, but for now, I'm happy to set it and forget it while I work on building stuff that actually runs on it

