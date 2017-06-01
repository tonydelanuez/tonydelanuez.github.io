---
title: ":movie_camera: MovieMate iOS App"
layout: post
date: 2017-03-08 08:10
tag: 
- iOS
- Swift
- Node.js
- OMDB API
- REST APIs
- iOS Development
image: ../assets/images/app-previews/moviesearch.png
headerImage: false
projects: true
hidden: true # don't count this post in blog pagination
description: "MovieMate utilizes the OMDB API to help users find movies to watch. Built in Swift.
category: project
author: tony
externalLink: false
---

![Screenshot](https://tonydelanuez.com/assets/app-previews/moviesearch.png)

# MovieMate iOS App

This app allows users to find information about movies. Data is pulled from the Open Movie Database’s [(OMDb) API](https://www.omdbapi.com). Users can search for movies, see the results in a collection view, and select a movie to view more details. Users can also favorite a movie and view all of their saved favorites on a different tab.

Extra Features: 

In favorites, users have the option to copy their list of favorites into the clipboard. I made sure to separate each with a new line so it's easily pasted into many different places without having to add lines. Also, favorites are immediately sorted alphabetically.

Underneath the option to add a movie to their favorites, users have the option to "Find a place to watch" which loads up a separate WebView pointing to JustWatch.com with the title as a search term and displays the different options they have online to watch the film (Netflix, iTunes, Hulu, etc.). This also required URL-ifying the title of the movie to switch spaces to "%20".

There is a third tab, "Hot Picks" which is a curated list of films by genre to suggest to the user if they are uncertain of what to watch. I mainly just wanted to learn how to use a UIPickerView, so this was a good way for me to do that.

---

## Technologies:

- iOS
- Swift
- OMDB API
- REST APIs


---

[Check it out](https://github.com/tonydelanuez/iOS-Movie-Mate-App) here.
