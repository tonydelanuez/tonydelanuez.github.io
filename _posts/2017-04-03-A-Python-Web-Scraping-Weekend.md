---
layout: post
title: A Python Web Scraping Weekend
date: 2017-04-03 4:12
tag:
- Python
- Web Scraping
- Node.js
- JavaScript
- ExpressJS

category: blog
author: tony
hidden: true
description: A recap on my weekend where I decided to expand my Python skills; I experimented with web scraping, converting CSV to JSON, running Python scripts (and setting up scheduled events) on a Node.js server, and sending data from the server to client entirely in JavaScript.  

---
## Background 
### What is Web Scraping?
Web scraping is fundamentally the extracting of large amounts of data from websites. I built a program in [Python](https://www.python.org/) that allowed me to grab data from the HTML tags of a website by implementing some neat searching functions found in a Python library called [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/). 

For example, with this web scraper I could grab data on prices for a given item (or all items, if you wanted) on my favorite shopping website and set up a notificaiton system to alert me when the price for that item drops below a certain threshold. Or you could go the more hilarious route and do what I did: monitor the social habits of users who comment on adult video websites. 
### Tools Used

As stated above, I used [Python](https://www.python.org/) in order to scrape the data from the site and [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) for the html parsing.  
In addition to those two, I used: 

* [Node.js](https://nodejs.org/) for the web server
* [csvtojson](https://www.npmjs.com/package/csvtojson) to convert my scraped CSV output to JavaScript-readable format
* [ExpressJS](https://expressjs.com/) to send data from my Node server to the client on a data request
* [Python-Shell](https://www.npmjs.com/package/python-shell) to run Python scripts on a Node server
* [Node-Schedule](https://github.com/node-schedule/node-schedule) to run my Python scripts at scheduled intervals

# The Project

This app used a Python script to scrape user comments from a random video on an adult entertainment site, then placed the images over inspirational wallpapers from reddit. Although the project seems foolish, I was able to learn a ton. 

I learned how to traverse HTML elements with Python in Beautiful Soup, output data from python into CSV format, read in CSV files in JavaScript and make Reddit API calls, and how to schedule Python scripts to run in specific time intervals on a Node server. 

This project could've been more functional had I wrote the tools in a way that allowed for better communication between each module. 

If I would have built the entire project with Django, the Python script wouldn't need to output CSV to be read in by my Node server or if I chose to write the web scraper in PHP I could schedule requests to scrape in PHP with something like Goutta. 

Instead, I chose to use both Python and JavaScript which led me to build a simple API with ExpressJS.
I'm not unhappy with this result; I've realized how my app could be improved and I ended up putting in a ton of practice in techniques I plan to use in my career as a full stack developer. 

The general flow of the app is as follows: 

1. Startup (app.js). Server starts, Python begins first scrape. 

2. Upon Python scrape completion, result data is output in CSV.  

3. At scheduled intervals or when the page is refreshed (should normalize this somehow), the Python script is rerun.

4. Node grabs a "random" entry from the comment data read in through the CSV file and sends to the client via the API I created with ExpressJS routing. 

5. User gets potentially comedic wallpaper. 


![Screenshot](https://github.com/tonydelanuez/Juxtaposition-Generator/raw/master/example_2.png)

[Here's](https://github.com/tonydelanuez/Juxtaposition-Generator/) the source code on GitHub if you'd like to see it! 


After finishing this project I posted it on a Facebook group called Hackathon Hackers just to see if anyone would give it a look and maybe get a chuckle out of my weekend expedition. To my surprise (and delight), the project was met with positivity from the community. I received comments and messages with suggestions on bugs to fix, how I could improve the app, and people who just wanted to tell me I made them laugh and that they couldn't wait to show it to their friends. 

I'm glad I built something fun while learning new technology and in the end got to show it to people who appreciated it. The "Juxtaposition Generator" was one of my simpler app endeavors, but extremely enjoyable nonetheless. 

Thanks for reading. 

___ 

Hopefully this post has helped you in some way. If you'd like more resources on the subject or would like clarification, feel free to post a comment below. 

-Tony












