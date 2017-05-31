---
title: ":laughing: Juxtaposition Generator"
layout: post
date: 2017-04-18 10:10
tag: 
- Python
- JavaScript
- Node.js
- Web Scraping
- ExpressJS
- Beautiful Soup
image: https://raw.githubusercontent.com/tonydelanuez/Juxtaposition-Generator/master/example_1.png
headerImage: false
projects: true
hidden: true # don't count this post in blog pagination
description: "Web application written in Python and JavaScript that generates combinations of comments from an adult video website and inspirational wallpapers from reddit.com."
category: project
author: tony
externalLink: false
---

![Screenshot](https://raw.githubusercontent.com/tonydelanuez/Juxtaposition-Generator/master/example_1.png)

# Juxtaposition Generator 

This is the app from my [blog post](http://tonydelanuez.com/A-Python-Web-Scraping-Weekend/) on Python web scraping!

This app used a Python script to scrape user comments from a random video on an adult entertainment site, then placed the images over inspirational wallpapers from reddit. Although the project seems foolish, I was able to learn a ton.


The general flow of the app is as follows:

1. Startup (app.js). Server starts, Python begins first scrape.

2. Upon Python scrape completion, result data is output in CSV.

3. At scheduled intervals or when the page is refreshed (should normalize this somehow), the Python script is rerun.

4. Node grabs a “random” entry from the comment data read in through the CSV file and sends to the client via the API I created with ExpressJS routing.

5. User gets potentially comedic wallpaper.

## Takeaways
I learned how to traverse HTML elements with Python in Beautiful Soup, output data from python into CSV format, read in CSV files in JavaScript and make Reddit API calls, and how to schedule Python scripts to run in specific time intervals on a Node server.

---

## Technologies:

- Python
- Python-Shell
- JavaScript
- Node.js
- csvtojson
- ExpressJS
- Node-Schedule


---

[Check it out](https://github.com/tonydelanuez/Juxtaposition-Generator/) here.
