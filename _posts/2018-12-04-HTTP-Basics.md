---
title: "HTTP Basics"
layout: post
date: 2018-12-04 20:00
tag: 
- networking
- http 
- oscp
headerImage: false
projects: false
hidden: false # don't count this post in blog pagination
description: "Brief notes on HTTP, frames, requests/responses"
category: blog
author: tony
externalLink: false
---
# HTTP Basics

- HTTP is an application layer protocol that is sent over TCP or over a TLS-encrypted TCP connection. 
- HTTP operates as client-server communication: requests are sent by the client (user-agent) to the server, which handles the request and provides a response.
- The client is always the entity initiating the request. 
- Between the client and server, many different computers/machines (called proxies) help relay the HTTP messages (mostly at the transport, network, or physical levels). 
- Proxies can do things such as caching, filtering, load balancing, authentication, logging, and many more. 

## HTTP FLOW: 

1. Client opens a TCP connection. Client may open a new connection, reuse an existing connection, or open several TCP connections to the servers. 
2. Client sends a simple message encapsulated in a frame (HTTP/2)
3. Client reads the response sent by the server 
4. Close/reuse the connection as needed for further requests. 

## HTTP Frames

A frame begins with a fixed 9-octet header followed by a variable-length payload: 

![HTTP Frame]('https://isc.sans.edu/diaryimages/images/http2(1).png')

Length: length of the payload as an unsigned 24-bit integer
Type: 8-bit type of the frame.
Flags: 8-bit field reserved for boolean flags specific to frame type
R: Reserved 1-bit field
Stream Identifier: unsigned 31-bit 

## HTTP Requests: 

Requests consist of: 
HTTP Method: GET/POST/PUT/DELETE, etc. that defines the operation the client wants to perform
Path: path of resource to fetch - URL of the resource without protocol, domain, or port. 
Version: version of the HTTP protocol
Optional headers or body

## HTTP Responses: 

Version: version of the HTTP protocol
Status code: indicating success/why or why not
Status message: description of status code
HTTP headers
(optional) Body: contains the fetched resource

HTTP requests are usually what you'll use to communicate with a website or an API! 
Check out how simple it is to craft requests with the [python requests library](http://docs.python-requests.org/en/master/) (and thanks to jsonplaceholder for the test API!):

    >>> import requests
    >>> resp = requests.get('https://jsonplaceholder.typicode.com/todos/1')
    >>> resp = requests.get('https://jsonplaceholder.typicode.com/todos/1')
    >>> resp.ok
    True
    >>> resp.content
    '{\n  "userId": 1,\n  "id": 1,\n  "title": "delectus aut autem",\n  "completed": false\n}'

