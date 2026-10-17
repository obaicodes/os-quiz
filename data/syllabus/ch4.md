# Chapter 4 — in-scope slide text

Source: `sources/syllabus/CH-4-Updated.pdf`. Slides marked with a green X are excluded.


**Excluded slides (8):** 23, 26, 27, 28, 29, 31, 32, 33


## Slide 1

Chapter 4:  Threads & 
Concurrency


## Slide 2

4.2
Chapter 4: Threads

Overview

Multicore Programming

Multithreading Models

Thread Libraries

Implicit Threading

Threading Issues

Operating System Examples


## Slide 3

4.3
Objectives

Identify the basic components of a thread, and contrast threads 
and processes

Describe the benefits and challenges of designng 
multithreaded applications

Illustrate different approaches to implicit threading including 
thread pools, fork-join, and Grand Central Dispatch

Describe how the Windows and Linux operating systems 
represent threads

Design multithreaded applications using the Pthreads, Java, 
and Windows threading APIs


## Slide 4

4.4
Motivation

Most modern applications are multithreaded

Threads run within application

Multiple tasks with the application can be implemented by 
separate threads
Update display
Fetch data
Spell checking
Answer a network request

Process creation is heavy-weight while thread creation is 
light-weight

Can simplify code, increase efficiency

Kernels are generally multithreaded


## Slide 5

4.5
Single and Multithreaded Processes


## Slide 6

4.6
Multithreaded Server Architecture


## Slide 7

4.7
Benefits

Responsiveness – may allow continued execution if part of 
process is blocked, especially important for user interfaces

Resource Sharing – threads share resources of process, easier 
than shared memory or message passing

Economy – cheaper than process creation, thread switching 
lower overhead than context switching

Scalability – process can take advantage of multicore 
architectures


## Slide 8

4.8
Multicore Programming

Multicore or multiprocessor systems putting pressure on 
programmers, challenges include:
Dividing activities
Balance
Data splitting
Data dependency
Testing and debugging

Parallelism implies a system can perform more than one task 
simultaneously

Concurrency supports more than one task making progress
Single processor / core, scheduler providing concurrency


## Slide 9

4.9
Concurrency vs. Parallelism

Concurrent execution on single-core system:

Parallelism on a multi-core system:


## Slide 10

4.10
Multicore Programming

Types of parallelism 
Data parallelism – distributes subsets of the same data 
across multiple cores, same operation on each
Task parallelism – distributing threads across cores, each 
thread performing unique operation


## Slide 11

4.11
Data and Task Parallelism


## Slide 12

4.12
User Threads and Kernel Threads

User threads - management done by user-level threads library

Three primary thread libraries:
 POSIX Pthreads
 Windows threads
 Java threads

Kernel threads - Supported by the Kernel

Examples – virtually all general purpose operating systems, including:
Windows 
Linux
Mac OS X
iOS
Android


## Slide 13

4.13
User and Kernel Threads


## Slide 14

4.14
Multithreading Models

Many-to-One

One-to-One

Many-to-Many


## Slide 15

4.15
Many-to-One

Many user-level threads mapped to 
single kernel thread

One thread blocking causes all to block

Multiple threads may not run in parallel 
on muticore system because only one 
may be in kernel at a time

Few systems currently use this model

Examples:
Solaris Green Threads
GNU Portable Threads


## Slide 16

4.16
One-to-One

Each user-level thread maps to kernel thread

Creating a user-level thread creates a kernel thread

More concurrency than many-to-one

Number of threads per process sometimes 
restricted due to overhead

Examples
Windows
Linux


## Slide 17

4.17
Many-to-Many Model

Allows many user level threads to be 
mapped to many kernel threads

Allows the  operating system to create 
a sufficient number of kernel threads

Windows  with the ThreadFiber 
package

Otherwise not very common


## Slide 18

4.18
Two-level Model

Similar to M:M, except that it allows a user thread to be 
bound to kernel thread


## Slide 19

4.19
Thread Libraries

Thread library provides programmer with API for creating 
and managing threads

Two primary ways of implementing
Library entirely in user space
Kernel-level library supported by the OS


## Slide 20

4.20
Pthreads

May be provided either as user-level or kernel-level

A POSIX standard (IEEE 1003.1c) API for thread creation and 
synchronization

Specification, not implementation

API specifies behavior of the thread library, implementation is 
up to development of the library

Common in UNIX operating systems (Linux & Mac OS X)


## Slide 21

4.21
Java Threads

Java threads are managed by the JVM

Typically implemented using the threads model provided by underlying OS

Java threads may be created by:

Extending Thread class

Implementing the Runnable interface

Standard practice is to implement Runnable interface


## Slide 22

4.22
Java Threads
Implementing Runnable interface:
Creating a thread:
Waiting on a thread:


## Slide 24

4.24
Fork-Join Parallelism

Multiple threads (tasks) are forked, and then joined.


## Slide 25

4.25
Fork-Join Parallelism


## Slide 30

4.30
Operating System Examples

Windows Threads

Linux Threads


## Slide 34

End of Chapter 4
