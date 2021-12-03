---
title: "Attacking Android - Quick Notes on Reverse Engineering Android Applications"
layout: post
date: 2019-10-28 12:00
tag: 
- security
- android
- java
headerImage: false
projects: false
hidden: true # don't count this post in blog pagination
description: "In this post I keep notes on tools I use to enumerate and reverse engineer Android applications"
category: blog
author: tony
externalLink: false
---

## Emulate the Application

[Android Studio](https://developer.android.com/studio) is your main toolbox for interacting with Android applications. Android Studio will let you spin up emulators for various Android devices and OS versions. With your apk running on an emulator, you can poke and prod the application to see if you can discover any bugs with the normal application runtime. 

    `adb install <myapk.apk>`

## Browse Application Storage

With an application running on an emulated Android Studio device, throw open an adb shell and inspect the `/data/data` directory: 

    `adb root && adb shell`
    `cd /data/data` 

## Prod the Database

Rip the database files from the application and pop them into a sqlite client. 
    `adb pull /data/data/<myapk.apk>/databases/<db.db> /my/local/database.db`
    `sqlite database.db`
    `select * from TABLE`

## Inspecting Network Traffic

[wireshark](https://www.wireshark.org/) will help you to capture the packets going to and from your emulated application. Wireshark now ships with a `tcpdump` module for interacting with the packets sent to and from Android applications, so snooping on network behavior couldn't be any easier!

## Viewing the Source

[apktool](https://ibotpeaches.github.io/Apktool/) allows you to decompile the apk (Android Application Package) and fetch its AndroidManifest, `resources.arsc`, and `classes.dex` into their original-ish formats. Running apktool on an Android application is an excellent way to start recon - here you can find informtion in the XML files packaged with the application and maybe find some secrets! Look for API keys, terribly secured DB creds, etc.

    `apktool d <myapk.apk>`

You can even use apktool to decompile, make some changes, then recompile after making some changes.

[dex2jar](https://github.com/pxb1988/dex2jar) allows you to convert an apk to a jar (Java ARchive) file. After you have a jar file, you can use something like [JD-GUI](http://java-decompiler.github.io/) to decompile and view the Java source code from the ".class" files. When you load your jar file into JD-GUI you'll see the (reconstructed) source and have access to all of the internals of the applciation, so long the bytecode is not obfuscated in a way that ruins the decompilation.
[More on bytecode obfuscation here.](https://www.owasp.org/index.php/Bytecode_obfuscation)

    `d2j-dex2jar.sh <myapk.apk>`

[jADX](https://github.com/skylot/jadx) is a command line and GUI tool that allows you to grab Java source code from Android Dex and APK files. jADX will do both the jobs of apktool and dex2jar for you! 

    `brew install jadx`
    `jadx -d output <myapk.apk>`

There are tons of available tools for Android reversing, just pick yours and jump in. Once you get source, start poking around to see what you can find. Monitor network traffic, check error logs, make some changes then recompile and install.
I'll try to keep this post up-to-date with tools I find useful for Android reversing.





