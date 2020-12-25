---
title: ":muscle: Arduino Fitbit Clone"
layout: post
date: 2016-04-05 08:10
tag: 
- Arduino
- C
- Java
- Protocols
image: ../assets/images/app-previews/arduinofitbit.png
headerImage: false
projects: true
hidden: true # don't count this post in blog pagination
description: "Arduino fitness tracker with PC communication protocol, step, sleep, and temperature tracking, user interface"
category: blog
author: tony
externalLink: false
---


# Arduino Fitbit Clone

I designed and built a fitness tracker with PC communication protocol, step, sleep, and temperature tracking, user interface. 

Watch the demo video below:

[![Arduino Fitbit Demonstration](https://tonydelanuez.com/assets/images/app-previews/arduinofitbit.png)](https://www.youtube.com/watch?v=SxzBoIkbFBo "Arduino Fitbit Demonstration")


## Features:

Fitbit Displays:

- The number of steps taken since the last reset of step mode
- The current rate of steps (in steps per hour) since the last reset of step mode
- The current temperature
- The total amount of sleep since the last reset of sleep mode


Dynamic Fitbit Display: it always graphs the most recent 45 seconds of accelerometer data. If the fitbit is in pedometer mode, the graph shows accelerometer data relevant to taking steps including annotations on the graph showing when a step (peak) is detected on the plot. This is only shown in pedometer mode.

 When in sleep mode the graph shows the cumulative high-quality sleep over time. (A good night’s rest would be a steadily increasing graph. A night with intermittent restlessness would increase, then plateau while the sleeper is restless, then increase again as they settle down to sleep)

## Protocol Design: 
I designed a protocol that sent from Java -> Arduino -> Java in order to properly display the data from the microcontroller and sensors. 

The protocol consists of a header to establish a connection, then a payload full of data. 

- Magic Number to establish connection
- Debugging Strings
- Error Strings
- Send temperature sensor readings
- Step counts
- Time spent asleep
- Total time app running



---

## Technologies:

- Arduino
- C
- Java
- Protocols
- StdDraw API


