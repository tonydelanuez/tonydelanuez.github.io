---
title: "Exception Handling - Why it matters and how to start!"
layout: post
date: 2018-09-22 12:00
tag: 
- python
- productive
headerImage: false
projects: false
hidden: false # don't count this post in blog pagination
description: "In this post I discuss try/catch in Python, and how/when we may do this in production-ready code."
category: blog
author: tony
externalLink: false
---
# Exception? What's this you say?

Exceptions are essentially errors in your program that are totally not what you had planned. When an exception occurs, your program will be thrown off course and may terminate. 

These troublemakers can come from anywhere! I/O failures, memory issues, improper use of a data structure, the list goes on - but it's important to know what type of exceptions you could be exposing yourself to in a program. 

## Why do they matter? 

At work, we build systems that handle **tons** of requests. Sometimes memory gets a little wonky and we receive values from the backend that we weren't expecting, or no value at all! Maybe we make an HTTP request and it ends up timing out instead of providing us that lovely JSON we're waiting for. We have to be ready for those instances! Now let's see how. 

## Okay, where do I start?

Let's take an example in python. First, we look at a function called get_strength. 

    def get_strength(character_dict): 
    """ Returns the STR attribute of a character (represented by a dictionary) """ 
    return character_dict['STR']
    
Now let's say I have a dictionary that represents a character for a game and each key is an attribute: 

    gimli = { 'HP': 16, 'INT': 7, 'STR': 20, 'SPD': 6}

I want the above function, **get_strength(character_dict) to return Gimli's STR attribute because we like [getters and setters](https://en.wikipedia.org/wiki/Mutator_method). This works fine with the gimli dictionary, it just returns gimli['STR']

    get_strength(gimli)
    >> 20

but now when I try get_strength on the dictionary for legolas below, what will happen?

    legolas = {'HP': 13, 'INT': 15, 'SPD': 17, 'DEX': 25}

There isn't a STR attribute for Legolas in this dictionary, so we'll get a [KeyError](https://wiki.python.org/moin/KeyError) in Python (the key is not in the dictionary). 

    >>> get_strength(legolas)
    Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
    File "<stdin>", line 2, in get_strength
    KeyError: 'STR'

But we can refactor this code to make it safe! Let's add a try/except (try/catch) block. A try/catch means we're going to *try* to do something and *catch* an exception if it occurs. We specify an exception type (below I use KeyError) and handle it exactly how I want to: by printing a meaningful error message that I can use for debugging.  

    def get_strength(character_dict): 
    """ Returns the STR attribute of a character (represented by a dictionary) """ 
    strength = None
    try: 
        strength = character_dict['STR']
    except KeyError: 
        print("Oh no! No STR attribute found.") 
    return strength

Now what happens when we call get_strength(legolas)?  No more KeyError :) We handle it gracefully instead of letting it crash our program - we provide a meaningful error message and return None in this case. What would you want to return? Maybe 0 is better, maybe some default value. Good thing to consider.

    >>> get_strength(legolas)
    Oh no! No STR attribute found.

We can even add a **finally** block that executes after both the try and except. Sometimes we want to do something regardless of what occurs during execution - put this in the **finally** section. 

    def get_strength(character_dict): 
    """ Returns the STR attribute of a character (represented by a dictionary) """ 
    strength = None
    try: 
        strength = character_dict['STR']
    except KeyError: 
        print("Oh no! No STR attribute found.") 
    finally: 
        print("Performed STR lookup")
    return strength

    >>> g_str = get_strength(gimli)
    Performed STR lookup
    >>> g_str
    20

## Wrapping up

It's really important when you're working on production code to look into the libraries and data structures you're using and become very aware of the exceptions you may see, and handle all of them! You don't want a service that's supposed to be running all the time breaking because not all edge cases were considered or you didn't think about what would happened if you tried to open a file that wasn't actually there. 

USE THE TRY/CATCH! But use it sparingly and be specific with the Errors you catch - sometimes you've gotta let things break to know what's going wrong. Don't just apply a cover-all. 

Think (and read) about how you could use try/excepts while using the Python [requests](http://docs.python-requests.org/en/master/) module - what might go wrong? This is a great exercise in scoping out possible bugs for a program that consumes an API! HTTP can be tricky and when you're running things at scale they're bound to throw errors some times, hopefully this will help you handle them. 

Let me know what you think below, or follow up with a question!

