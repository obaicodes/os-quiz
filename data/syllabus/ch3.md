# Chapter 3 — in-scope slide text

Source: `sources/syllabus/CH-3-Updated.pdf`. Slides marked with a green X are excluded.


**Excluded slides (13):** 12, 24, 25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39


## Slide 1

Chapter 3:  Processes


## Slide 2

3.2
Chapter 3:  Processes

Process Concept

Process Scheduling

Operations on Processes

Interprocess Communication

IPC in Shared-Memory Systems

IPC in Message-Passing Systems

Examples of IPC Systems

Communication in Client-Server Systems


## Slide 3

3.3
Objectives

Identify the separate components of a process and illustrate 
how they are represented and scheduled in an operating 
system.

Describe how processes are created and terminated in an 
operating system, including developing programs using the 
appropriate system calls that perform these operations.

Describe and contrast interprocess communication using 
shared memory and message passing.

Design programs that uses pipes and POSIX shared memory 
to perform interprocess communication.

Describe client-server communication using sockets and 
remote procedure calls.

Design kernel modules that interact with the Linux operating 
system.


## Slide 4

3.4
Process Concept

An operating system executes a variety of programs that run as a 
process.

Process – a program in execution; process execution must 
progress in sequential fashion

Multiple parts
The program code, also called text section
Current activity including program counter, processor 
registers
Stack containing temporary data
Function parameters, return addresses, local variables
Data section containing global variables
Heap containing memory dynamically allocated during run time


## Slide 5

3.5
Process Concept (Cont.)

Program is passive entity stored on disk (executable file); 
process is active 
Program becomes process when executable file loaded into 
memory

Execution of program started via GUI mouse clicks, command 
line entry of its name, etc

One program can be several processes
Consider multiple users executing the same program


## Slide 6

3.6
Process in Memory


## Slide 7

3.7
Memory Layout of a C Program


## Slide 8

3.8
Process State

As a process executes, it changes state
New:  The process is being created
Running:  Instructions are being executed
Waiting:  The process is waiting for some event to occur
Ready:  The process is waiting to be assigned to a processor
Terminated:  The process has finished execution


## Slide 9

3.9
Diagram of Process State


## Slide 10

3.10
Process Control Block (PCB)
Information associated with each process 
(also called task control block)

Process state – running, waiting, etc

Program counter – location of instruction 
to next execute

CPU registers – contents of all process-
centric registers

CPU scheduling information- priorities, 
scheduling queue pointers

Memory-management information – 
memory allocated to the process

Accounting information – CPU used, clock 
time elapsed since start, time limits

I/O status information – I/O devices 
allocated to process, list of open files


## Slide 11

3.11
Threads

So far, process has a single thread of execution

Consider having multiple program counters per process
Multiple locations can execute at once
Multiple threads of control -> threads

Must then have storage for thread details, multiple program 
counters in PCB

Explore in detail in Chapter 4


## Slide 13

3.13
Process Scheduling

Maximize CPU use, quickly switch processes onto CPU core

Process scheduler selects among available processes for 
next execution on CPU core

Maintains scheduling queues of processes
Ready queue – set of all processes residing in main 
memory, ready and waiting to execute
Wait queues – set of processes waiting for an event (i.e. 
I/O)
Processes migrate among the various queues


## Slide 14

3.14
Ready and Wait Queues


## Slide 15

3.15
Representation of Process Scheduling


## Slide 16

3.16
CPU Switch From Process to Process
A context switch occurs when the CPU 
switches from one process to another.


## Slide 17

3.17
Context Switch

When CPU switches to another process, the system must save 
the state of the old process and load the saved state for the 
new process via a context switch

Context of a process represented in the PCB

Context-switch time is overhead; the system does no useful 
work while switching
The more complex the OS and the PCB  the longer the 
context switch

Time dependent on hardware support
Some hardware provides multiple sets of registers per CPU 
 multiple contexts loaded at once


## Slide 18

3.18
Multitasking in Mobile Systems

Some mobile systems (e.g., early version of iOS)  allow only one 
process to run, others suspended

Due to screen real estate, user interface limits iOS provides for a 
Single foreground process- controlled via user interface
Multiple background processes– in memory, running, but not 
on the display, and with limits
Limits include single, short task, receiving notification of events, 
specific long-running tasks like audio playback

Android runs foreground and background, with fewer limits
Background process uses a service to perform tasks
Service can keep running even if background process is 
suspended
Service has no user interface, small memory use


## Slide 19

3.19
Operations on Processes

System must provide mechanisms for:
 process creation
 process termination


## Slide 20

3.20
Process Creation

Parent process create children processes, which, in turn 
create other processes, forming a tree of processes

Generally, process identified and managed via a process 
identifier (pid)

Resource sharing options
Parent and children share all resources
Children share subset of parent’s resources
Parent and child share no resources

Execution options
Parent and children execute concurrently
Parent waits until children terminate


## Slide 21

3.21
A Tree of Processes in Linux


## Slide 22

3.22
Process Creation (Cont.)

Address space
Child duplicate of parent
Child has a program loaded into it

UNIX examples
fork() system call creates new process
exec() system call used after a fork() to replace the 
process’ memory space with a new program
Parent process calls wait() for the child to terminate


## Slide 23

3.23
Process Termination

Process executes last statement and then asks the operating 
system to delete it using the exit() system call.
Returns  status data from child to parent (via wait())
Process’ resources are deallocated by operating system

Parent may terminate the execution of children processes  using 
the abort() system call.  Some reasons for doing so:
Child has exceeded allocated resources
Task assigned to child is no longer required
The parent is exiting and the operating systems does not 
allow  a child to continue if its parent terminates


## Slide 26

3.26
Interprocess Communication

Processes within a system may be independent or cooperating

Cooperating process can affect or be affected by other processes, 
including sharing data

Reasons for cooperating processes:
Information sharing
Computation speedup
Modularity
Convenience

Cooperating processes need interprocess communication (IPC)

Two models of IPC
Shared memory
Message passing


## Slide 27

3.27
Communications Models 
(a) Shared memory.  
(b) Message passing.


## Slide 28

3.28
Cooperating Processes

Independent process cannot affect or be affected by the execution 
of another process

Cooperating process can affect or be affected by the execution of 
another process

Advantages of process cooperation
Information sharing 
Computation speed-up
Modularity
Convenience


## Slide 29

3.29
Interprocess Communication – Message Passing

Mechanism for processes to communicate and to synchronize 
their actions

Message system – processes communicate with each other 
without resorting to shared variables

IPC facility provides two operations:
send(message)
receive(message)

The message size is either fixed or variable


## Slide 40

End of Chapter 3
