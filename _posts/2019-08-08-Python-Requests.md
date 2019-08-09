---
title: "Quick Directory Scanner with Python Requests"
layout: post
date: 2019-08-08 12:00
tag: 
- security
- python
headerImage: false
projects: false
hidden: false # don't count this post in blog pagination
description: "In this blog I briefly explain the python-requests package and demo of how to write a directory scanner"
category: blog
author: tony
externalLink: false
---
# Disclaimer
This is for educational purposes - do not do directory scanning on any host you do not own or have explicit permission to scan. You can/likely will face serious punishment. 

## Python-Requests
[python-requests](https://2.python-requests.org/en/master/) is one of the libraries that makes me love Python: it's simple, easy to understand, easy to use, and gives you tons of functionality with little code. 

Requests allows you to make HTTP/S requests with Python code. 

A quick demo from their site: 

    >>> r = requests.get('https://api.github.com/user', auth=('user', 'pass'))
    >>> r.status_code
    200
    >>> r.headers['content-type']
    'application/json; charset=utf8'
    >>> r.encoding
    'utf-8'
    >>> r.text
    u'{"type":"User"...'
    >>> r.json()
    {u'private_gists': 419, u'total_private_repos': 77, ...}


Requests is amazing for building and testing web applications, especially ones that consume REST APIs because you can generate python dictionaries from the JSON response of the web server. You can modify headers (in case you want to perform some User-Agent spoofing maybe), stream downloads, chunk requests, tamper with cookies, and do tons of other cool stuff.

## Quick directory scanner: 

I'll throw together scripts like this when I'm doing a CTF to test response codes of a target server without using something like DirBuster/GoBuster. With `python-requests` I can programmatically check for certain keywords in the web server's response/source (easy key finding!) or classify pages by the returned status_code. 

This script will open a [dirbuster wordlist](https://raw.githubusercontent.com/digination/dirbuster-ng/master/wordlists/common.txt), make HTTP requests to a host, then collect a list of directories that return a certain status code (200 in this case)

Something like this can be thrown together in a few minutes but can save you a lot of time or run in the background while you perform manual probing of the target.


    import requests
    import time

    victim = 'http://localhost:4000/'
    dir_file = 'common.txt'

    with open(dir_file) as f: 
        dirs = f.readlines()
        for directory in dirs:
            directory = directory.rstrip() # strip newline characters
            response = requests.get(victim + directory + '/')
            if response.ok:
                print(directory)

Scanning my local test server (this site) returned the following results:

About, Blog, Index, Projects, about, assets, blog, index, projects, tags

Easy! Now we've got some directories to poke around in.

If I were making this more robust, I'd do things like:

- add a `time.sleep(0.1)` statement after the request so I wait a small amount of time between requests

- use python `threading` in order to spawn multiple threads for requests.

- use `argparse` to add options for a wordlist and hostname

- add [exception handling](https://tonydelanuez.com/Exception-Handling/) to handle any HTTPErrors

- possibly filter based on the lowercase version of the string being unique

Python-requests is an exceptional library and you should definitely be using it if you're working with Python.