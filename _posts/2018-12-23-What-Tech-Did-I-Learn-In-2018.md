---
title: "What Tech Did I Learn in 2018?"
layout: post
date: 2018-12-23 12:00
tag: 
- networking
- learning
- software engineering 
headerImage: false
projects: false
hidden: false # don't count this post in blog pagination
description: "Inspired by a HackerNews post, I've decided to reflect on the technologies I've learned or improved on this year."
category: blog
author: tony
externalLink: false
---

# 2018 in review - what technologies did I learn/improve on? 

Inspired by [this HackerNews post](https://news.ycombinator.com/item?id=18745763), I've decided to reflect on the technologies I've learned or improved on this year. 

### Linux: 
- Networking
- Syscalls
- Process Management
- Locks
- Scheduling
- I/O multiplexing
- Forensics (Memory, Processes, Timing)

I ended my time at WashU with a deeper dive into Linux internals after finishing up our three-class systems software and operating systems track. As an SRE these skills are invaluable: much of our alerting revolves around monitoring processes, load on hosts, I/O errors, etc. There's not a day at work where I don't interact with Linux systems in some way. 

### Security

One of my goals for 2019 is to pass the Offensive Security Certified Professional (OSCP) exam. 
From the Offensive Security site: 
>  Earning this designation indicates that you  can conduct a penetration test from start to finish within a target-rich, diverse, and vulnerable network environment, a skill set that is highly valued and in increasing demand within the industry.

I've studied networking and security, and have started getting into CTFs and exploiting vulnerable machines (in a lab environment). I'm currently at at: 

- TCP/IP
- Scripting attacks with Python
- Buffer Overflows
- XSS, SQL Injection, CSRF, other exploits from the OWASP Top 10. 


### Programming
- Go
- WebDriver (Python)
- Fabric (Python)
- Celery (Python)

I'm trying to pick up Golang as a systems language; I get to use Python at work but when I'm looking for something performant I'd like to be able to reach for Go right away rather than writing up C/C++/Java. 
I've also spent a significant amount of time creating bots that interact with websites exactly as a user would using Python's [Selenium](https://selenium-python.readthedocs.io) library. This library allows you to write Python (or JavaScript) that controls a browser. It's **excellent** for scripting workflows, web scraping, and even as a tool to monitor your service's functionality. 

### Infrastructure
- AWS
- Caching (Redis)
- Message Brokers/Queues:  Redis, RabbitMQ, SQS
- Databases (and Postgres): 
- Load Balancing

In building scalable, resilient systems, I've had the ability to learn about cloud infrastructure, caching in order to improve application performance, utilizing async tasks and messaging systems in order to defer work and queue up jobs. I took the Database Mangement Systems Course at WashU taught by Doug Shook and learned the inner workings of databases then at work I've had the opportunity to work with and study a large Postgres instance and pgbouncer for connection balancing


### Monitoring
- Datadog
- Cloudwatch

I look at a **ton** of dashboards while at work. This is an interesting one - at school I was never really exposed to monitoring applications and this definitely took me by surprise. Crafting excellent (yet concise enough) monitoring dashboards and alerts (and choosing the right metrics!) is an art I'm consistently amazed at. The [Google SRE Book](https://landing.google.com/sre/books/) does a great job at explaining how you can pick metrics that are meaningful and expose potential problems. 


*Feel free to leave a comment if you'd like some resources on any of these areas or want to share what you've studied*