---
layout: post
title: Why Develop Web Apps in the MEAN Stack?
date: 2017-01-15 13:08
tag:
- MEAN Stack
- JavaScript
- PHP
- Ruby on Rails
- Web Development
category: blog
author: tony
description: An in-depth report on the effectiveness of the MEAN stack vs other relevant web development technologies and projected growth/decline based on what developers "need". Includes runtime performance reports, tiobe index data for language popularity comparison, and BLS job growth forecasting. 

---


## A glance at the job market


Software development is a rapidly growing industry; the Bureau of Labor Statistics reported 1,114,000 software engineering jobs in 2014 and ten percent growth in job outlook from 2014 to 2024, compared to mechanical engineering with 277,500 jobs and five percent growth, and electrical engineering at 315,900 jobs and zero percent growth. 

![alt text](http://tonydelanuez.com/assets/blog/1/jobs.png "Job Market at a Glance")


_Figure 1: “Where the STEM Jobs Will Be”, BLS.gov data analyzed by the Computing Research Association predicts that 65% of the newly created STEM job openings in 2012-2022 will be in computing, followed by 17% in engineering._

The Computing Research Association analyzed the BLS data and prepared the chart seen in Figure 1. Computing is growing at a staggering rate compared to other jobs in STEM fields.  However, software engineers continue to struggle with the early decision of which programming languages and technologies to learn on their entry into computer science. There are over three hundred programming languages, each with their own advantages and applications; to become fit for a job utilizing that language, one must dedicate a substantial amount of time committed to learning its syntax and usage then go on to build projects in the language to understand it at a higher level.

## Who is this post geared towards? 
Ideally if you’re reading this, you’re familiar with programming at least to a basic extent. You have an interest in web technologies and applications, along with their development and implementation; you may have taken a programming course in college or have reviewed a few tutorials to get your feet wet. However, if you’re very new to the programming world some of the terminology may confuse you. I try to explain some of the basics of web applications and the web in general, but some topics may be missed by people who haven’t worked with web development in the past. If you’re a seasoned veteran in coding/programming/development, the topics should come easy to you and you may benefit from the comparisons of the MEAN stack to other programming languages and frameworks.

## What does this have to do with the MEAN stack? 
In this post, I discuss the advantages of using the MEAN stack over other popular web development technologies. To start, a “stack” is a combination of software products and/or programming languages used to create a web or mobile application. In web development, there are many different web stacks available that developers employ to build web pages and applications. The MEAN Stack is a combination of four technologies: MongoDB for the database, ExpressJS as a server-side or back-end framework, AngularJS as the front-end framework, and Node.js to link it all together in a powerful JavaScript-based server-side script execution environment. 

The MEAN Stack is used to create fully scalable web applications written entirely in JavaScript (excluding the HTML and CSS). Other popular alternatives are Ruby on Rails, Django (Python), Java/Scala, Laravel (PHP), and many others. The MEAN stack has grown to extreme popularity in the last few years, boasting a huge developer community with a large variety
of full-scale applications already built on the platform. Stacks are chosen because the technologies work very well together and are generally most of what a developer needs to build a fully functional application. Based on these criteria, I seek a definitive answer as to why MEAN (and its components) has grown so much hype in the last few years compared to its competitors. 


## How exactly do technology stacks work in an application? 
A software stack commonly has the following: 

**Databases**- databases manage your data and put it into a format so it can easily be modified. Database driven applications commonly use forms to move data to and from databases using the four basic SQL (Structured Query Language) commands: create, read, update, delete. Although MongoDB is a NoSQL database (which will be addressed later), it supports these commands.

**Server-side framework** – server-side frameworks generate the “back end” of the application. This allows you as a developer to add pages easily, create links between pages, add functionality with scripts, etc.

**Front-End Framework** – front-end frameworks allow the developer to customize the client side of the application and present information to the user. The client side is fundamentally what renders in the user’s browser when the site is visited. Front-end frameworks usually give the developer a clever way to manipulate data easily and in a unique, appealing way to the consumer. 

For a quick summary of how a web application works: 

1.	User enters domain name into browser, this forms a request

2.	When domain is entered (or link clicked), a request is made for the webpage document using HTTP, or Hypertext Transfer Protocol. 

3.	The web server where the webpage is hosted then provides the file to the browser, this is the response. The browser must also retrieve all the resources that make up the webpage: scripts, stylesheets, media.

4.	Once all resources are retrieved and the Document Object Map, CSS Object Map, and the render tree are constructed, the browser connects them together and renders a page. 

The user can then interact with the forms and content on the page, which will send GET/POST requests to the server and prompt it to manipulate data in the database and display the new values.  Figure 2 from Upwork.com demonstrates visually how this process works. They break it down into five different steps, each very similar to what I explained above. 

![alt text](http://tonydelanuez.com/assets/blog/1/frontend.png "Webpage Description")

_Figure 2: Basic breakdown of how a webpage works._

Carey Woodhouse from Upwork writes, 

>“Overall, they’re creating a web-based application that comes as close to a desktop experience as possible. Their focus is on user experience, and the technology they implement will hinge on how well it accomplishes that speed, efficiency, and smooth functionality.” (Woodhouse)

The reliance on speed, efficiency, and functionality forces developers to be very careful in their choice of programming languages and technologies. They want something that accomplishes these goals and is also scalable, easy to update, aesthetically pleasing, and robust. 


## Why MEAN? 
Once you as a developer understand how a web app works, you’re now at the point of deciding which technologies you’d like to use to build your application. At this step, many decisions must be made but there are some distinct features to the MEAN stack that its competitors fail to match. One of the most significant features of the MEAN stack is that it uses one language, JavaScript, for everything, making it extremely attractive to developers. The MEAN stack is also highly scalable and works extremely well in Cloud-based applications because of the package management with NPM (Node Package Manager) – an explanation as to why eBay, LinkedIn, Uber, the New York Times, and more all use Node.js (the key component of MEAN) for their servers. Touching further on Node, it is also operating system-independent; it runs at the same speeds across Windows, OS X, and Linux. Not only can it be developed on any operating system with ease, client-side viewing and use of Node (and therefore MEAN) applications has no degradation of quality across user platforms (desktop, mobile, tablets). Developing an application entirely in one language (JavaScript) also allows for the development team to easily manage both the front and back end since they use the same language, which can be an outstanding advantage for small developer teams working on the entire application.  

JavaScript, the programming language of MEAN, has amassed many followers over the last few years; I’ve included in Figure 3 a very popular image in leading people to JavaScript development. With the  many different applications of JavaScript, jobs in JS should always be plentiful and projects developed in it will always be relevant.

![alt text](http://tonydelanuez.com/assets/blog/1/github.png "JavaScipt Github projects")

_Figure 3: Prevalence of JavaScript in high-rated GitHub projects_

As you can see in Figure 3 from the number of GitHub projects with 1000 plus stars, JavaScript rules the market when it comes to programming languages. JavaScript is so popular for the following reasons: 

1. JavaScript powers the Web
Most web applications are built in JavaScript. This alone allows JavaScript to control the market because the mobile market is split between Java (Android) and Swift (iOS). Also, almost all websites have some sort of JavaScript built in.

2. Node.js
JavaScript surged again when Node.js allowed JavaScript developers to build the backend for their sites and applications, that is, Node.js created a way for developers to manage databases, run server-side scripts, and build full apps entirely in JavaScript with ease. 

3. NPM
NPM is a package manager that allows for the installation of third-party Node modules that add functionality to web applications. NPM installations are as simple as “npm install expressjs”. NPM has a huge developer community with over 75,000 publicly-available modules; JavaScript developers have flooded the market with different plugins and frameworks to quickly implement previously difficult challenges with ease, such as authorization, encryption, payment options, and many more.

4. The developer community: 
JavaScript with its massive following, allows developers to easily learn the language because of the comprehensive documentation and available support, tutorials, and reference online. 

At the time of writing, there are 1,270,297 JavaScript-tagged questions on Stack Overflow, an online community where developers help each other solve problems and share knowledge about programming.

YouTube returns about 3,540,000 results if you search for “JavaScript”. The videos include descriptions of what JavaScript is, code tutorials, and even walkthroughs on how to build complete applications. 

Websites like Udemy, Coursera, Udacity, and Codecademy, W3Schools, CodeSchool, and many more help developers learn different aspects of JavaScript and its implementations; some courses have full university-level coursework while others offer hands-on, interactive tutorials.

## Diving into Node.js
Node.js is what is called a *“headless JavaScript runtime.”* It is the same JavaScript Engine that runs inside of Google Chrome (V8), but allows JavaScript to be run from the command line of your (or the host) computer. Node.js allows for the running of modules, or packages of functions that can be imported and exported. It is lightweight and efficient, two of the main qualities that make it ideal for building web applications that run off on a wide array of devices and operating systems. Node also allows for asynchronous events and notifications, that is, applications where updates from multiple clients or users can be seen by everyone else in real time - like a Google Doc. 

In an experiment performed by Kai Lei, Yining Ma, and Zhi Tan at Peking University, Node.js doubled the performance of PHP (one of the oldest, most highly used programming languages for the web) in a simple “mean requests per second” test, and scored seven times higher than Python-Web.  Figure 4, shown below, outlines the mean time per request data of each prevalent web technology. Node.js has the quickest response time (although PHP comes close). In their study, they test many different benchmarks and Node.js continually comes out on top. For example, the group concluded in the 2014 study that Node.js was able to manage a significantly larger number of users than the other two technologies (Lei, Ma, Tan). 

![alt text](http://tonydelanuez.com/assets/blog/1/studyresults.png "Study Results")


_Figure 4: Results from “Calculate Fibonacci(10/20/30)” mean requests per second (higher is better), pulled from the Lei, Ma, Tan study._


## An aside about MongoDB and RESTful web services
MongoDB fits the use case of a startup quickly building an application with the desire of speed and flexibility. MongoDB also returns data in JavaScript Object Notation (JSON) by default, allowing for the easy development of RESTful web services and manipulation of data without having to transform it. Oracle’s explanation of a RESTful web service is as follows, 

>“RESTful web services are built to work best on the web. Representational State Transfer (REST) is an architectural style that specifies contraints, such as the uniform interface, that if applied to a web service induce desirable properties, such as performance, scalability, and modifiability, that enables services to work best on the Web.” 
The oracle documentation on the Java EE 6 Tutorial also explains the key principles of a RESTful application to be simple lightweight, and fast: 

>**Resource identification through URI**: A RESTful web service exposes a set of resources that identify the targets of the interaction with its clients. Resources are identified by URIs, which provide a global addressing space for resource and service discovery. See The @Path Annotation and URI Path Templates for more information.

>**Uniform interface**: Resources are manipulated using a fixed set of four create, read, update, delete operations: PUT, GET, POST, and DELETE. PUT creates a new resource, which can be then deleted by using DELETE. GET retrieves the current state of a resource in some representation. POST transfers a new state onto a resource. See Responding to HTTP Methods and Requests for more information.

>**Self-descriptive messages**: Resources are decoupled from their representation so that their content can be accessed in a variety of formats, such as HTML, XML, plain text, PDF, JPEG, JSON, and others. Metadata about the resource is available and used, for example, to control caching, detect transmission errors, negotiate the appropriate representation format, and perform authentication or access control. See Responding to HTTP Methods and Requests and Using Entity Providers to Map HTTP Response and Request Entity Bodies for more information.

>**Stateful interactions through hyperlinks**: Every interaction with a resource is stateless; that is, request messages are self-contained. Stateful interactions are based on the concept of explicit state transfer. Several techniques exist to exchange state, such as URI rewriting, cookies, and hidden form fields. State can be embedded in response messages to point to valid future states of the interaction. See Using Entity Providers to Map HTTP Response and Request Entity Bodies and “Building URIs” in the JAX-RS Overview document for more information. (Oracle) 

MongoDB supports all the above principles, making it a favorable candidate in the development of web applications. For example, in Figure 5 I’ve shown the return format of MongoDB data (JSON). This format allows for easy queries, the map structure is commonly used and very easy to understand.

![alt text](http://tonydelanuez.com/assets/blog/1/mongo.png "Mongo JSON")

_Figure 5: Sample Data from MongoDB organized in JSON format_

In the past, MongoDB has been criticized with regards to dropping data; some developers were very worried that it may not suit an application where transactional guarantees are needed. When dealing with currency or other very pertinent information, they said MongoDB was risky as there had been “cases” of MongoDB reporting a successful transaction when it didn’t go through. Eliot Horowitz, CTO and co-founder of MongoDB refuted these points. He points out that there have been some incidents but as the product is always evolving these bugs have been worked out and MongoDB remains a stable platform (HackerNews, Observer). I’ve included the detailed explanations of these issues in the references if these are topics of interest for you as a reader. 

## Growth/decline analysis of competing technologies
Quincy Larson, an instructor at FreeCodeCamp.com wrote a great analysis on the growth trends of web technologies from 2012 to 2016. In his analysis he says that large development teams are choosing to go with Node.js due to the “high performance and massive ecosystem of tools” (Larson). A few examples he notes of large companies making the shift to Node.js: 

>Walmart switched over to Node.js on a Black Friday, got more than 200 million visitors that day, and never went above 1% CPU.

>LinkedIn rewrote their mobile backend in Node.js, and proceeded to get 20 times the performance out of 1/10 the servers.

>Groupon increased page load speed by 50% by switching from Ruby on Rails to Node.js. They also reported being able to launch new features much faster than before.

>Paypal did an experiment where two teams built identical apps - one in Java and one in Node.js. The Node.js team built theirs in half the time. The Node.js app had response times that were 50% faster than the Java app.” (Larson)

>Node continues to allow companies to reduce costs and improve the performance of their web applications while scaling up and still minimizing load on their servers. 

Figure 6 shows the percentage of job postings that mention Ruby on Rails versus Node.js, Python Django, and PHP Laravel: 

![alt text](http://tonydelanuez.com/assets/blog/1/jobgrowthtrend.png "Job Growth in Relevant Technologies")

_Figure 6: Job Growth trend in relevant web technologies_

According to the above figure, Node.js development jobs are on rise with almost double the amount of openings Ruby on Rails offers and ten times the amount of job openings available with PHP Laravel. Larson notes, 

>“Even with Node.js becoming dominant, some development teams will choose to build new projects using Ruby on Rails thanks to its documentation, developer-friendliness, and stability.” (Larson) 

JavaScript currently holds rank number seven on the TIOBE Index as of November 2016. For background on the Tiobe index from their site, “The ratings are calculated by counting hits of the most popular search engines. The counted hits are normalized for each search engine for all languages in the list.” Basically, the TIOBE index rates programming languages based on how often they are searched for. JavaScript has been on a steady climb on the TIOBE Index while PHP continues to fall, as seen below in Figure 7. 

![alt text](http://tonydelanuez.com/assets/blog/1/tiobeJS.png "Tiobe JavaScript")

![alt text](http://tonydelanuez.com/assets/blog/1/tiobePHP.png "Tiobe PHP")

_Figure 7: The TIOBE Index reports a steady increase in relevance of JavaScript since 2012, while PHP has been falling in market share since 2010._

As Node.js continues to progress and evolve with its open-source libraries, the demand for development in JavaScript will rise, while PHP will continue to fall. PHP 7 is an attempt to save the language as it adds a vast amount of features but it still viewed as the old, out-of-date language by many the current generation of developers. Ruby on Rails is popular among the current generation but Node is propelling JavaScript past it as well. Zend.com touts the benefits of PHP 7 compared to PHP 5.6,

 >Thanks to the new Zend Engine 3.0, your apps see up to 2x faster performance and 50% better memory consumption than PHP 5.6, allowing you to serve more concurrent users without adding any hardware. Designed and refactored for today’s workloads, PHP 7 is the ultimate choice for web developers today. (Zend.com)

A two-time performance increase and 50% better memory consumption will not allow PHP to beat the performance of Node-based apps, as shown in the benchmarks of the Lei, Ma, Tan study. If PHP wishes to remain relevant there must be humongous improvements in runtime. Ruby on Rails  has begun to fall behind as the trend for “isomorphic apps” develops. Isomorphic apps are applications “that can run both client-side and server-side. The backend and frontend share the same code.” (Isomorphic.net)

Spike Brehm writes for Airbnb on the importance and prevalence of “Isomorphic JavaScript in the Wild.” He mentions Meteor, Asana, Mojito, Rendr (an Airbnb original) as examples of isomorphism in the JavaScript ecosystem. (Brehm) Ruby on Rails simply does not have the same number of options in terms of libraries that support isomorphism. If the development community continues to favor isomorphic apps, Ruby on Rails may take a huge hit in the future. 

## In Conclusion: The Lean, MEAN, App Developing Machine
As long as JavaScript continues to climb, the MEAN stack will continue to grow with it. In good news for MEAN, JavaScript doesn’t look like it will stop its massive growth any time soon. Angular 2, the successor to AngularJS, has been released and basically revamps the framework while adding massive functionality. Early adopters of Angular 2 can also be drawn to the MEAN stack based on how well the technologies work together. These technologies will also benefit greatly as more companies welcome Node for their server-side work and hire developers to build applications on the framework. Node (and the MEAN stack in its entirety) has shown no signs of slowing down; if the current trends hold it will continue to be an increasingly useful technology for building web applications in the distant future, given how long PHP has been able to stay relevant.

If the TIOBE index trends and performance benchmarks presented are any good for predicting the future state of the programming language market, it looks as though JavaScript, and hopefully the MEAN stack, will maintain its hold on the web application development world. 

### References 

1. Lei, Kai, Yining Ma, and Zhi Tan. "Performance Comparison and Evaluation of Web
Development Technologies in PHP, Python, and Node.js." _2014 IEEE 17th
International Conference on Computational Science and Engineering_ (2014):
n. pag. Web. 

2. "From CTO of 10gen First, I Tried to Find Any Client of Ours with a Track Record... |
Hacker News." _From CTO of 10gen First, I Tried to Find Any Client of
Ours with a Track Record... | Hacker News_. N.p., n.d. Web. 05 Dec. 2016. 

3. "Is Ruby on Rails Fading?" _Is Ruby on Rails Fading? – Larson, Quincy - Quora_.
N.p., n.d. Web. 05 Dec. 2016. 

4. "Isomorphic JavaScript: The Future of Web Apps - Airbnb Engineering." _Brehm_, _Spike -__Airbnb Engineering_. N.p., 2016. Web. 05 Dec. 2016. 

5. "JavaScript | TIOBE - The Software Quality Company." _JavaScript | TIOBE - The
Software Quality Company_. N.p., n.d. Web. 05 Dec. 2016. 

6. "PHP 7 Makes Powering the Web a Whole Lot Better." _PHP 7 Makes Powering the
Web a Whole Lot Better_. N.p., n.d. Web. 05 Dec. 2016. 

7. Popper,Ben. "The Trolls Come Out For 10Gen." _Observer_. N.p., 2011.
Web. 05 Dec. 2016. 

8. "Software Engineers" _U.S. Bureau of Labor Statistics_. U.S. Bureau of Labor
Statistics, n.d. Web. 05 Dec. 2016. 

9. "Mechanical Engineers _U.S. Bureau of Labor Statistics_. U.S. Bureau of Labor
Statistics, n.d. Web. 05 Dec. 2016. 

10. "Electrical and Electronics Engineers _U.S. Bureau of Labor Statistics_. U.S. Bureau
of Labor Statistics, n.d. Web. 05 Dec. 2016.

11. Wodehouse, Carey. "What Does a Front-End
Developer Do? - Hiring Headquarters." _Hiring | Upwork_. N.p., 2016.
Web. 05 Dec. 2016