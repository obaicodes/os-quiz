# Chapter 2 — in-scope slide text

Source: `sources/syllabus/CH-2-Updated.pdf`. Slides marked with a green X are excluded.


**Excluded slides (7):** 24, 25, 32, 33, 34, 41, 43


## Slide 1

Chapter 2:  Operating-System 
Structures


## Slide 2

2.2
Chapter 2:  Operating-System Structures

Operating System Services

User and Operating System-Interface

System Calls

System Services

Linkers and Loaders

Why Applications are Operating System Specific

Operating-System Design and Implementation

Operating System Structure

Building and Booting an Operating System


## Slide 3

2.3
Objectives

Identify services provided by an operating system

Illustrate how system calls are used to provide operating 
system services

Compare and contrast monolithic, layered, microkernel, 
modular, and hybrid strategies for designing operating 
systems

Illustrate the process for booting an operating system

Apply tools for monitoring operating system performance

Design and implement kernel modules for interacting with a 
Linux kernel


## Slide 4

2.4
Operating System Services

Operating systems provide an environment for execution of programs 
and services to programs and users

One set of operating-system services provides functions that are 
helpful to the user:

User interface - Almost all operating systems have a user 
interface (UI).
Varies between Command-Line (CLI), Graphics User
Interface (GUI), touch-screen,  Batch

Program execution - The system must be able to load a program 
into memory and to run that program, end execution, either 
normally or abnormally (indicating error)

I/O operations - A running program may require I/O, which may 
involve a file or an I/O device

File-system manipulation - The file system is of particular 
interest. Programs need to read and write files and directories, 
create and delete them, search them, list file Information, 
permission management.


## Slide 5

2.5
Operating System Services (Cont.)

One set of operating-system services provides functions that are helpful to 
the user (Cont.):

File-system manipulation - The file system is of particular interest. 
Programs need to read and write files and directories, create and delete 
them, search them, list file Information, permission management.

Communications – Processes may exchange information, on the same 
computer or between computers over a network
Communications may be via shared memory or through message 
passing (packets moved by the OS)

Error detection – OS needs to be constantly aware of possible errors
May occur in the CPU and memory hardware, in I/O devices, in user 
program
For each type of error, OS should take the appropriate action to 
ensure correct and consistent computing
Debugging facilities can greatly enhance the user’s and 
programmer’s abilities to efficiently use the system


## Slide 6

2.6
Operating System Services (Cont.)

Another set of OS functions exists for ensuring the efficient operation of the 
system itself via resource sharing

Resource allocation - When  multiple users or multiple jobs running 
concurrently, resources must be allocated to each of them
Many types of resources -
CPU cycles, main memory, file storage, 
I/O devices.

Logging - To keep track of which users use how much and what kinds 
of computer resources

Protection and security - The owners of information stored in a 
multiuser or networked computer system may want to control use of 
that information, concurrent processes should not interfere with each 
other
Protection involves ensuring that all access to system resources is 
controlled
Security of the system from outsiders requires user authentication, 
extends to defending external I/O devices from invalid access 
attempts


## Slide 7

2.7
A View of Operating System Services


## Slide 8

2.8
User Operating System Interface - CLI
CLI or command interpreter allows direct command entry

Sometimes implemented in kernel, sometimes by systems 
program

Sometimes multiple flavors implemented – shells

Primarily fetches a command from user and executes it

Sometimes commands built-in, sometimes just names of 
programs
If the latter, adding new features doesn’t require shell 
modification


## Slide 9

2.9
User Operating System Interface - GUI

User-friendly desktop metaphor interface

Usually mouse, keyboard, and monitor

Icons represent files, programs, actions, etc

Various mouse buttons over objects in the interface cause 
various actions (provide information, options, execute function, 
open directory (known as a folder)

Invented at Xerox PARC

Many systems now include both CLI and GUI interfaces

Microsoft Windows is GUI with CLI “command” shell

Apple Mac OS X is “Aqua” GUI interface with UNIX kernel 
underneath and shells available

Unix and Linux have CLI with optional GUI interfaces (CDE, 
KDE, GNOME)


## Slide 10

2.10
Touchscreen Interfaces

Touchscreen devices require new 
interfaces

Mouse not possible or not desired

Actions and selection based on 
gestures

Virtual keyboard for text entry

Voice commands


## Slide 11

2.11
System Calls

Programming interface to the services provided by the OS

Typically written in a high-level language (C or C++)

Mostly accessed by programs via a high-level 
Application Programming Interface (API) rather than 
direct system call use

Three most common APIs are Win32 API for Windows, 
POSIX API for POSIX-based systems (including virtually 
all versions of UNIX, Linux, and Mac OS X), and Java API 
for the Java virtual machine (JVM)
Note that the system-call names used throughout this text are 
generic


## Slide 12

2.12
Example of System Calls

System call sequence to copy the contents of one file to another file


## Slide 13

2.13
Example of Standard API


## Slide 14

2.14
System Call Implementation

Typically, a number associated with each system call

System-call interface maintains a table indexed according to 
these numbers

The system call interface invokes  the intended system call in OS 
kernel and returns status of the system call and any return values

The caller need know nothing about how the system call is 
implemented

Just needs to obey API and understand what OS will do as a 
result call

Most details of  OS interface hidden from programmer by API  
Managed by run-time support library (set of functions built 
into libraries included with compiler)


## Slide 15

2.15
API – System Call – OS Relationship


## Slide 16

2.16
System Call Parameter Passing

Often, more information is required than simply identity of desired 
system call

Exact type and amount of information vary according to OS 
and call

Three general methods used to pass parameters to the OS

Simplest:  pass the parameters in registers
 In some cases, may be more parameters than registers

Parameters stored in a block, or table, in memory, and 
address of block passed as a parameter in a register 
This approach taken by Linux and Solaris

Parameters placed, or pushed, onto the stack by the program 
and popped off the stack by the operating system

Block and stack methods do not limit the number or length of 
parameters being passed


## Slide 17

2.17
Parameter Passing via Table


## Slide 18

2.18
Types of System Calls

Process control

create process, terminate process

end, abort

load, execute

get process attributes, set process attributes

wait for time

wait event, signal event

allocate and free memory

Dump memory if error

Debugger for determining bugs, single step execution

Locks for managing access to shared data between processes


## Slide 19

2.19
Types of System Calls (cont.)

File management

create file, delete file

open, close file

read, write, reposition

get and set file attributes

Device management

request device, release device

read, write, reposition

get device attributes, set device attributes

logically attach or detach devices


## Slide 20

2.20
Types of System Calls (Cont.)

Information maintenance

get time or date, set time or date

get system data, set system data

get and set process, file, or device attributes

Communications

create, delete communication connection

send, receive messages if message passing model to host 
name or process name
From client to server

Shared-memory model create and gain access to memory 
regions

transfer status information

attach and detach remote devices


## Slide 21

2.21
Types of System Calls (Cont.)

Protection

Control access to resources

Get and set permissions

Allow and deny user access


## Slide 22

2.22
Examples of Windows and Unix System Calls


## Slide 23

2.23
Standard C Library Example

C program invoking printf() library call, which calls write() system call


## Slide 26

2.26
System Services

System programs provide a convenient environment for program 
development and execution.  They can be divided into:

File manipulation 

Status information sometimes stored in a file

Programming language support

Program loading and execution

Communications

Background services

Application programs

Most users’ view of the operation system is defined by system 
programs, not the actual system calls


## Slide 27

2.27
System Services (cont.)

Provide a convenient environment for program development and 
execution

Some of them are simply user interfaces to system calls; others 
are considerably more complex

File management - Create, delete, copy, rename, print, dump, list, 
and generally manipulate files and directories

Status information

Some ask the system for info - date, time, amount of available 
memory, disk space, number of users

Others provide detailed performance, logging, and debugging 
information

Typically, these programs format and print the output to the 
terminal or other output devices

Some systems implement  a registry - used to store and 
retrieve configuration information


## Slide 28

2.28
System Services (Cont.)

File modification

Text editors to create and modify files

Special commands to search contents of files or perform 
transformations of the text

Programming-language support - Compilers, assemblers, 
debuggers and interpreters sometimes provided

Program loading and execution- Absolute loaders, relocatable 
loaders, linkage editors, and overlay-loaders, debugging systems 
for higher-level and machine language

Communications - Provide the mechanism for creating virtual 
connections among processes, users, and computer systems

Allow users to send messages to one another’s screens, 
browse web pages, send electronic-mail messages, log in 
remotely, transfer files from one machine to another


## Slide 29

2.29
System Services (Cont.)

Background Services

Launch at boot time
Some for system startup, then terminate
Some from system boot to shutdown

Provide facilities like disk checking, process scheduling, error 
logging, printing

Run in user context not kernel context

Known as services, subsystems, daemons 

Application programs

Don’t pertain to system

Run by users

Not typically considered part of OS

Launched by command line, mouse click, finger poke


## Slide 30

2.30
Linkers and Loaders

Source code compiled into object files designed to be loaded into any 
physical memory location – relocatable object file

Linker combines these into single binary executable file

Also brings in libraries

Program resides on secondary storage as binary executable

Must be brought into memory by loader to be executed

Relocation assigns final addresses to program parts and adjusts code 
and data in program to match those addresses

Modern general purpose systems don’t link libraries into executables

Rather, dynamically linked libraries (in Windows, DLLs) are loaded 
as needed, shared by all that use the same version of that same library 
(loaded once)

Object, executable files have standard formats, so operating system knows 
how to load and start them


## Slide 31

2.31
The Role of the Linker and Loader


## Slide 35

2.35
Implementation

Much variation

Early OSes in assembly language

Then system programming languages like Algol, PL/1

Now C, C++

Actually usually a mix of languages

Lowest levels in assembly

Main body in C

Systems programs in C, C++, scripting languages like PERL, 
Python, shell scripts

More high-level language easier to port to other hardware

But slower

Emulation can allow an OS to run on non-native hardware


## Slide 36

2.36
Operating System Structure

General-purpose OS is very large program

Various ways to structure ones

Simple structure – MS-DOS

More complex -- UNIX

Layered – an abstraction

Modules


## Slide 37

2.37
Monolithic Structure – Original UNIX

UNIX – limited by hardware functionality, the original UNIX operating 
system had limited structuring.  

The UNIX OS consists of two separable parts

Systems programs

The kernel
Consists of everything below the system-call interface and 
above the physical hardware
Provides the file system, CPU scheduling, memory 
management, and other operating-system functions; a large 
number of functions for one level


## Slide 38

2.38
Traditional UNIX System Structure
Beyond simple but not fully layered


## Slide 39

2.39
Layered Approach

The operating system is 
divided into a number of layers 
(levels), each built on top of 
lower layers.  The bottom layer 
(layer 0), is the hardware; the 
highest (layer N) is the user 
interface.

With modularity, layers are 
selected such that each uses 
functions (operations) and 
services of only lower-level 
layers


## Slide 40

2.40
Modules

Many modern operating systems implement loadable kernel 
modules (LKMs)

Uses object-oriented approach

Each core component is separate

Each talks to the others over known interfaces

Each is loadable as needed within the kernel

Overall, similar to layers but with more flexible

Linux, Solaris, etc.


## Slide 42

2.42
Building and Booting an Operating System

Operating systems generally designed to run on a class of systems 
with variety of peripherals

Commonly, operating system already installed on purchased 
computer

But can build and install some other operating systems

If generating an operating system from scratch
Write the operating system source code
Configure the operating system for the system on which it will 
run
Compile the operating system
Install the operating system
Boot the computer and its new operating system


## Slide 44

2.44
System Boot

When power initialized on system, execution starts at a fixed memory 
location

Operating system must be made available to hardware so hardware can 
start it

Small piece of code – bootstrap loader, BIOS, stored in ROM or 
EEPROM locates the kernel, loads it into memory, and starts it

Sometimes two-step process where boot block at fixed location 
loaded by ROM code, which loads bootstrap loader from disk

Modern systems replace BIOS with Unified Extensible Firmware 
Interface (UEFI)

Common bootstrap loader, GRUB, allows selection of kernel from 
multiple disks, versions, kernel options

Kernel loads and system is then running

Boot loaders frequently allow various boot states, such as single user 
mode


## Slide 45

End of Chapter 2
