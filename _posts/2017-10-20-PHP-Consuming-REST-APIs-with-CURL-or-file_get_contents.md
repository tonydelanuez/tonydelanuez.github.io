---
layout: post
title: PHP - Consuming REST APIs with CURL or file_get_contents
date: 2017-10-20 19:45
tag:
- PHP
- Web Development
- REST APIs
category: blog
author: tony
description: A case study on the usage of curl vs file_get_contents() in order to consume a REST API.

---

![PHP Logo](http://tonydelanuez.com/assets/blog/5/php.png "PHP Logo")

Recently I was using PHP to consume some REST APIs with PHP. Normally I had done this through [CURL](http://php.net/manual/en/book.curl.php), but during a code review my reviewer mentioned that I should have just used PHP's file_get_contents(). I had seen a discussion on file_get_contents() vs CURL and decided that since cURL was more adaptable of a tool, it was the better choice. Turns out I was wrong. Metaphorically speaking, file_get_contents() is the trusty flathead screwdriver that gets the job done smooth and easy. I was using a power drill with multiple speed settings, a level, gel grip, and a sweet orange paintjob in order to tighten a loose leg on my chair.

## CURL
Taking from [haxx.se](https://curl.haxx.se/docs/manpage.html): 

Client URL Library (cURL) allows you to transfer data from or to a server using one of the many different networking protocols: 

- HTTP/S
- FILE
- FTP 
- IMAP 
- TELNET 

The list goes on. 
The great thing about cURL is the customizability. cURL allows you to specify proxy support, authentication, HTTP post, SSL connections, cookies, etc. Basically, it has a ton of options that let you specify how you interact with the URL in so many useful ways, yet also provides you some pretty decent defaults. 

Say I wanted to get some data from the google maps API using PHP, I could use the following code: 


	$url = "https://maps.googleapis.com/maps/api/geocode/json";
	$data = array(
		"address" => "Oxford University, uk", 
		"sensor" => "false"
		);

	$query_url = sprintf("%s?%s", $url, http_build_query($data));
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $query_url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 10);
	curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
	curl_setopt($curl, CURLOPT_HEADER, 0);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
	$http_code = curl_getinfo($curl , CURLINFO_HTTP_CODE);
	$result = curl_exec($curl);

	header('Content-type: application/json');
	echo $result;
	curl_close($curl);


Pretty beasty, right? 
I made sure that I didn't care about verifying the SSL layer, set my timeout for the http request, made sure to set the returntransfer so I get the data back as a string...

But there's a quicker way.

## file_get_contents

As long as I've got the proper configs (allow_url_fopen) set on my php.ini file, I can use file_get_contents in order to do the same thing in a very simple manner. 


    $url = "https://maps.googleapis.com/maps/api/geocode/json";
    $data = array(
            "address" => "Oxford University, uk",
            "sensor" => "false"
            );
    $query_url = sprintf("%s?%s", $url, http_build_query($data));
    header('Content-type: application/json');
    echo file_get_contents($query_url);

We still get our Google maps API data, exactly the same as before! 

This would've saved me some headache in setting the CURL flags, and is just flat-out easier. 

## How do I know which one to use? 

So clearly, file_get_contents is easier to use when you're consuming APIs. You can even set a stream context in order to send POST/UPDATE requests with file_get_contents. 

You might consider using CURL if: 
	
- You need a very finely tuned request. [See CURL options](http://php.net/manual/en/function.curl-setopt.php)
- You don't have allow_url_fopen allowed on your system. 
- You need multiple parallel handlers
- You want to handle timeout settings (I guess these all go with the finely tuned request theme)

Basically, if you're doing simple GET/POST requests and file_get_contents() is working for you, you're fine. If you notice for some reason that your file_get_contents() is a little buggy and maybe you need to be a bit more specific with your request, opt for the CURL option. 




