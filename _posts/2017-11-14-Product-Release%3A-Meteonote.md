---
title: ":book: Meteonote.io"
layout: post
date: 2017-11-14 08:10
tag: 
- JavaScript
- Web Development
- Node.js
- JavaScript
- MongoDB
- ExpressJS
- Mongoose
- YouTube API
image: ../assets/app-previews/meteonote.png
headerImage: false
projects: true
hidden: false # don't count this post in blog pagination
description: "Meteonote allows you to make playlists of YouTube videos and take Markdown notes that render while you type. You can queue up a few videos, take notes in the editor, and when you're done, export your notes in a PDF. Or you can save your progress and come back later!"
category: project
author: tony
externalLink: false
---
# Meteonote.io Post-Mortem

I just released the beta for [Meteonote.io](https://meteonote.io), and I'm writing to explain a bit about how it went down - starting from idea phase, turning that idea into a prototype, then refining the prototype and turning it into something that I felt I could show off to others. 

This wasn't without hurdles and there are definitely still bugs in the site and things to be improved on, but at this point in time I think the app is in a stage where people can get some use out of it. In fact, I'm typing this in the app itself!

## What is Meteonote? 
Meteonote allows you to make playlists of YouTube videos and take Markdown notes that render while you type. You can queue up a few videos, take notes in the editor, and when you're done, export your notes in a PDF. Or you can save your progress and come back later!

## Why build Meteonote?

I built Meteonote because I take a **ton** of notes on YouTube videos (MIT lectures for algorithms, ML, etc.) and I hated balancing having a text editor open and changing around which video I was watching. I figured it'd be nice to have an app that put all this functionality into one place. I knew I wanted the app to have three things: 

1. Video playlists
2. A place to enter notes and see them render as you type
3. A way to download your notes 

### MVP
I pitched the idea to my then-partner in WUSTL's web development class - he liked it and we didn't have any better ideas for a final project, so we went with it. He worked on UI while I worked on the internals, key features, and all of the backend/deployment. We ended up with a pretty decent MVP. Sure, it was buggy - but it worked and was pretty cool. 

Like most final projects, the app (then called WatchAlong) died as the class ended. I went away to SF to work two jobs, my partner continued to do both school and full-time work and we didn't talk all summer. 

### Rebirth

A few weeks ago, I started to think about the project I liked. I loved working in Node and I knew the app had potential, it just wasn't very useful in its current state. I took to my whiteboard and started redesigning elements of the site and came up with key issues I wanted to fix. My plan was that if the issues were intellectually stimulating enough,  I'd rebuild the app. 30-40 hours of work later and I had gutted nearly fully rewritten the project. Out of fairness to my partner (and a few consistency reasons) I decided to remove all of the code he had written.

## Technology Decisions

Meteonote was built in full-stack JavaScript - JavaScript + jQuery on the front end, Node.js on the backend with Express for routing and ejs for templating, and MongoDB as the database. 

### JavaScript

I decided to use pure vanilla JavaScript and jQuery because I just flat out enjoy working with JavaScript and jQuery. One of the jobs I had this summer was building a web app in PHP, JS + jQuery and having to do everything myself increased my comfort with and knowledge of JavaScript immensely.

### Databases

I knew I wanted a NoSQL database because I wasn't set in stone on how I wanted the relationships between tables to work. I ended up drawing an entity relationship diagram for Meteonote when I started the rework, but even those relationships may change  when I decide to add new features. For now, it made more sense for me to go with NoSQL so I could change schema whenever I wanted with little to no issue. 

This actually became useful right away. Initially, each user had their account info (username, hashed and salted passwords, etc.) and a field called "playlist". The playlist was just a JSON-ified string that contained a YouTube ID and a title for the video. We used this to perform the lookup for the user's playlist when they logged into the page and when they wrote to the playlist, deleted items, etc. I decided to split the data into three databases: **"Users"**, **"Documents"**,  and **"Playlists"**. With this split I'm spreading the work out across different tables and not making my user items so heavy. This format also allows me to easily adapt the app with new features since the three are just linked on different fields. 

## Problems

### How do we *properly* render Markdown? 

To render markdown, I used [Remarkable](https://github.com/jonschlinkert/remarkable). Remarkable is an open source JavaScript library built and maintained by Jon Schlinkert. I decided to use a library here because Remarkable just does it so well. There's a pretty large community around the project, with people adding support for emojis, images, other keyboards, the list goes on. 

To render the user input I catch keyups inside the textarea then make calls to render the input as HTML in a separate div (the preview window). This makes it so that the user experiences little to no delay in typing out their content and watching it appear on the right-hand side of the page. 

### How do we mange video playlists? 

The YouTube API provides a very nice way of working with YouTube videos embedded into applications (go figure). In the backend, user playlists are stored in key value pairs - the key provided is the unique YouTube ID for the video, the value is the title of the video. When a user pastes a URL into the bar above, I check and make that sure that the URL is indeed for a YouTube video, strip away all characters I don't need (base address, query parameters left in the URL), then send the ID to the YouTube API in order to retrieve the title of the video. I then use a simple JS array/list implementation of a queue in order to manage the videos entering an exiting the playlist. 

### How do we export to PDF? 

[jsPDF](https://parall.ax/products/jspdf) provides a way to turn text to HTML. I'm still trying to iron out some issues with taking images embedded in HTML and getting them to properly render in the PDF, but for the most part jsPDF has us covered as long as we're setting it up correctly with our optional parameters. jsPDF is pretty finicky when it comes to rendering straight from an HTML document, so I've poured a good amount of time into getting it the workflow from input text to rendered markdown (HTML) to PDF as smooth as possible without any issue to the end user. 

### Okay the app is built... how can people get to my Node app?

Prior to this app, I didn't plan for my Node apps to be visited by a large (hopefully?) amount of users at once, or even off of my own computer. In order to get this bad boy into the real world, I spun up a server on [Linode](linode.com), installed Ubuntu 16.04, and got to configuring. I use [NGINX](https://www.nginx.com/) as a reverse proxy (and for UFW - a robust, easy to configure firewall) and [PM2](http://pm2.keymetrics.io/) to keep the app up and running. I also tried out [Forever JS](https://github.com/foreverjs/forever) as a 'make node app run all the time' solution but decided to go with PM2 due to the larger amount of documentation readily available. SSL certificates were generated with [certbot](https://certbot.eff.org/). 

### I also ran into a ton of (varying size) bugs/issues, here are a few critical ones:  

* Without being careful, JavaScript scoping can be a real pain. If you're using ES2016, make sure to take advantage of cool new things like the 'let' keyword! And string interpolation. String interpolation is a beautiful thing, really glad to see that it's a core function in the language now. 

* DON'T MAKE API CALLS TO OTHER SITES FROM CLIENT SIDE, ESPECIALLY WITH A KEY. Just don't do it. You're exposing your API key to the world - something you definitely don't want to do. Handle all that work on the backend. Use the Request node library to consume a REST API, take the parts of the data you need, then feed it to your client when they make an HTTP request. 

* Be careful with AJAX manipulating DOM elements. When I made it easier to add videos to the playlist quickly I promptly found out that adding videos to the playlist could crash client's UI. This was because every time I was adding an element I would go and send the entire new playlist to the server, wait for a response, then refresh the entire playlist by requesting it from the server then rendering it all in a table. 

	This seems fine at first, but if you added enough videos you'd eventually start hitting request lag and the playlist would never refresh. The user would be left with no videos in the playlist. I decided to manipulate DOM elements entirely through the UI - since they are now free from the AJAX calls the UI is a lot more responsive and doesn't run into the same freezing issues. 

* Always check your inputs and account for edge cases! Operating on a null value can crash your site. This took Meteonote down more than I'd like to admit. If you're going to call a method from a variable, make sure the variable isn't null! It's easy to make this mistake. Sometimes all it takes is a missed initialization or an empty value in an array to take down your site. 

* Try using your app in ways you wouldn't assume people would use it. Click a button 100 times, enter empty values, resize the page, try it on different browers, resolutions. Break it. Fix what you break. Better to catch it now than when it's in someone elses hands. 

## Takeaways

Building Meteonote has been an extremely gratifying experience for me. Not only did I build something that I've been using on a daily basis, but I learned and grew as a software engineer. I took a product from start to (never finished) release state and put it up for the world to see. I plan to continue working on Metenote and improving it as much as I possibly can.

This project allowed me to gain a deeper understanding of JavaScript (along with ExpressJS, MongoDB, and Node.js), combining asynchronous calls in order to give a smooth user experience, and using the YouTube API to consume and deliver content. 


---

## Technologies:

- JavaScript
- Node.js
- YouTube API
- ExpressJS
- MongoDB
- Mongoose
- NGINX

---

[Check it out](https://meteonote.io) here.
