---
title: ":book: WatchAlong Web App"
layout: post
date: 2017-04-24 08:10
tag: 
- JavaScript
- Web Development
- Node.js
- JavaScript
- MongoDB
- ExpressJS
- Mongoose
- YouTube API
image: ../assets/app-previews/watchalong.png
headerImage: false
projects: true
hidden: true # don't count this post in blog pagination
description: "WatchAlong allows users to add videos from YouTube to a playlist and take notes which are automatically generated into Markdown and exportable into PDF format. NodeJS, YouTube API, jsPDF, etc."
category: project
author: tony
externalLink: false
---

![Screenshot](https://raw.githubusercontent.com/tonydelanuez/WatchAlong-Web-App/master/screenshot.png)

# WatchAlong Web App 

## - Built by Tony De La Nuez and Greg York

We created a lecture video viewing webpage utilizing JavaScript (Node) and MongoDB. The site will allows a user to view lecture videos while simultaneously taking notes on the same page. The notes can be written as markdown and will then be converted as such on the same page for the viewer. The user will then have the option to export their notes to a pdf.

## Users can: 

	- Log in (Authentication done with Passport)
	- Input URLs for YouTube videos to create playlist
	- Type notes in left box
	- Generate Markdown notes
	- Export Markdown notes to PDF
	- Recover their playlists by logging in 


We heavily utilized the Youtube API to allow for playlists that automatically move to the next video, display video descriptions on our page, etc.
We also added buttons that users can use to help style the page if they don't have a strong grasp of markdown.
Users playlists also store in the database so they always have them on logging in!

---

## Technologies:

- JavaScript
- Node
- YouTube API
- ExpressJS
- MongoDB
- Mongoose

---

[Check it out](https://github.com/tonydelanuez/WatchAlong-Web-App) here.
