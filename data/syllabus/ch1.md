# Chapter 1 — in-scope slide text

Source: `sources/syllabus/CH-1-Updated.pdf`. Slides marked with a green X are excluded.


**Excluded slides (22):** 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 61, 63, 65, 67, 68, 69, 70


## Slide 1

Chapter 1:  Introduction


## Slide 2

1.2
Chapter 1: Introduction
▪
What Operating Systems Do
▪
Computer-System Organization
▪
Computer-System Architecture
▪
Operating-System Operations
▪
Resource Management
▪
Security and Protection
▪
Virtualization
▪
Distributed Systems
▪
Kernel Data Structures
▪
Computing Environments


## Slide 3

1.3
Objectives
▪
Describe the general organization of a computer system and the role 
of interrupts
▪
Describe the components in a modern, multiprocessor computer 
system
▪
Illustrate the transition from user mode to kernel mode
▪
Discuss how operating systems are used in various computing 
environments
▪
Provide examples of free and open-source operating systems


## Slide 4

1.4
What is an Operating System?
▪
A program that acts as an intermediary between a user of a 
computer and the computer hardware
▪
Operating system goals:
•
Execute user programs and make solving user problems 
easier
•
Make the computer system convenient to use
•
Use the computer hardware in an efficient manner


## Slide 5

1.5
Computer System Structure
▪
Computer system can be divided into four components:
•
Hardware – provides basic computing resources
CPU, memory, I/O devices
•
Operating system
Controls and coordinates use of hardware among various 
applications and users
•
Application programs – define the ways in which the system 
resources are used to solve the computing problems of the users
Word processors, compilers, web browsers, database systems, 
video games
•
Users
People, machines, other computers


## Slide 6

1.6
Abstract View of Components of Computer


## Slide 7

1.7
What Operating Systems Do
▪
Depends on the point of view
▪
Users want convenience, ease of use and good performance 
•
Don’t care about resource utilization
▪
But shared computer such as mainframe or minicomputer must keep 
all users happy
•
Operating system is a resource allocator and control program 
making efficient use of HW and managing execution of user 
programs
▪
Users of dedicate systems such as workstations have dedicated 
resources but frequently use shared resources from servers
▪
Mobile devices like smartphones and tables are resource poor,  
optimized for usability and battery life
•
Mobile user interfaces such as touch screens, voice recognition
▪
Some computers have little or no user interface, such as embedded 
computers in devices and automobiles
•
Run primarily without user intervention


## Slide 8

1.8
Defining Operating Systems
▪
Term OS covers many roles
•
Because of myriad designs and uses of OSes
•
Present in toasters through ships, spacecraft, game machines, 
TVs and industrial control systems
•
Born when fixed use computers for military became more 
general purpose and needed resource management and 
program control


## Slide 9

1.9
Operating System Definition
▪
No universally accepted definition
▪
“Everything a vendor ships when you order an operating system” is a 
good approximation
•
But varies wildly
▪
“The one program running at all times on the computer” is the kernel, 
part of the operating system
▪
Everything else is either
•
A system program (ships with the operating system, but not part of 
the kernel) , or
•
An application program, all programs not associated with the 
operating system
▪
Today’s OSes for general purpose and mobile computing also include 
middleware – a set of software frameworks that provide additional 
services to application developers such as databases, multimedia, 
graphics


## Slide 10

1.10
Overview of Computer System Structure


## Slide 11

1.11
Computer System Organization
▪
Computer-system operation
•
One or more CPUs, device controllers connect through common 
bus providing access to shared memory
•
Concurrent execution of CPUs and devices competing for memory 
cycles


## Slide 12

1.12
Computer-System Operation
▪
I/O devices and the CPU can execute concurrently
▪
Each device controller is in charge of a particular device type
▪
Each device controller has a local buffer
▪
Each device controller type has an operating system device driver
to manage it
▪
CPU moves data from/to main memory to/from local buffers
▪
I/O is from the device to local buffer of controller
▪
Device controller informs CPU that it has finished its operation by 
causing an interrupt


## Slide 13

1.13
Common Functions of Interrupts
▪
Interrupt transfers control to the interrupt service routine 
generally, through the interrupt vector, which contains the 
addresses of all the service routines
▪
Interrupt architecture must save the address of the interrupted 
instruction
▪
A trap or exception is a software-generated interrupt caused 
either by an error or a user request
▪
An operating system is interrupt driven


## Slide 14

1.14
Interrupt Timeline


## Slide 15

1.15
Interrupt Handling
▪
The operating system preserves the state of the CPU by 
storing the registers and the program counter
▪
Determines which type of interrupt has occurred:
▪
Separate segments of code determine what action should 
be taken for each type of interrupt


## Slide 16

1.16
Interrupt-drive I/O Cycle


## Slide 17

1.17
I/O Structure
▪
Two methods for handling I/O
•
After I/O starts, control returns to user program only 
upon I/O completion
•
After I/O starts, control returns to user program without 
waiting for I/O completion


## Slide 18

1.18
I/O Structure (Cont.)
▪
After I/O starts, control returns to user program only upon I/O 
completion
•
Wait instruction idles the CPU until the next interrupt
•
Wait loop (contention for memory access)
•
At most one I/O request is outstanding at a time, no 
simultaneous I/O processing
▪
After I/O starts, control returns to user program without waiting for 
I/O completion
•
System call – request to the OS to allow user to wait for I/O 
completion
•
Device-status table contains entry for each I/O device 
indicating its type, address, and state
•
OS indexes into I/O device table to determine device status 
and to modify table entry to include interrupt


## Slide 19

1.20
Storage Structure


## Slide 20

1.21
Storage Structure
▪
Main memory – only large storage media that the CPU can 
access directly
•
Random access
•
Typically volatile
•
Typically random-access memory in the form of 
Dynamic Random-access Memory (DRAM)
▪
Secondary storage – extension of main memory that provides 
large nonvolatile storage capacity


## Slide 21

1.22
Storage Structure (Cont.)
▪
Hard Disk Drives (HDD) – rigid metal or glass platters covered 
with magnetic recording material 
•
Disk surface is logically divided into tracks, which are subdivided 
into sectors
•
The disk controller determines the logical interaction between 
the device and the computer 
▪
Non-volatile memory (NVM) devices– faster than hard disks, 
nonvolatile
•
Various technologies
•
Becoming more popular as capacity and performance increases, 
price drops


## Slide 22

1.23
Storage Definitions and Notation Review
The basic unit of computer storage is the bit. A bit can contain one of two
values, 0 and 1. All other storage in a computer is based on collections of bits.
Given enough bits, it is amazing how many things a computer can represent:
numbers, letters, images, movies, sounds, documents, and programs, to name
a few. A byte is 8 bits, and on most computers it is the smallest convenient
chunk of storage. For example, most computers don’t have an instruction to
move a bit but do have one to move a byte. A less common term is word,
which is a given computer architecture’s native unit of data. A word is made
up of one or more bytes. For example, a computer that has 64-bit registers and
64-bit memory addressing typically has 64-bit (8-byte) words. A computer
executes many operations in its native word size rather than a byte at a time.
Computer storage, along with most computer throughput, is generally
measured and manipulated in bytes and collections of bytes. A kilobyte, or
KB , is 1,024 bytes; a megabyte, or MB, is 1,0242 bytes; a gigabyte, or GB, is
1,0243 bytes; a terabyte, or TB, is 1,0244 bytes; and a petabyte, or PB, is 1,0245
bytes. Computer manufacturers often round off these numbers and say that
a megabyte is 1 million bytes and a gigabyte is 1 billion bytes. Networking
measurements are an exception to this general rule; they are given in bits
(because networks move data a bit at a time).


## Slide 23

1.24
Storage Hierarchy
▪
Storage systems organized in hierarchy
•
Speed
•
Cost
•
Volatility
▪
Caching – copying information into faster storage system; main 
memory can be viewed as a cache for secondary storage
▪
Device Driver for each device controller to manage I/O
•
Provides uniform interface between controller and kernel


## Slide 24

1.25
Storage-Device Hierarchy


## Slide 25

1.26
How a Modern Computer Works
A von Neumann architecture


## Slide 26

1.27
Direct Memory Access Structure
▪
Used for high-speed I/O devices able to transmit information 
at close to memory speeds
▪
Device controller transfers blocks of data from buffer storage 
directly to main memory without CPU intervention
▪
Only one interrupt is generated per block, rather than the one 
interrupt per byte


## Slide 27

1.28
Operating-System Operations
▪
Bootstrap program – simple code to initialize the system, load the 
kernel
▪
Kernel loads
▪
Starts system daemons (services provided outside of the kernel)
▪
Kernel interrupt driven (hardware and software)
•
Hardware interrupt by one of the devices 
•
Software interrupt (exception or trap):
Software error (e.g., division by zero)
Request for operating system service – system call
Other process problems include infinite loop, processes 
modifying each other or the operating system


## Slide 28

1.29
Multiprogramming (Batch system)
▪
Single user cannot always keep CPU and I/O devices busy 
▪
Multiprogramming organizes jobs (code and data) so CPU 
always has one to execute
▪
A subset of total jobs in system is kept in memory
▪
One job selected and run via job scheduling
▪
When job has to wait (for I/O for example), OS switches to 
another job


## Slide 29

1.30
Multitasking (Timesharing)
▪
A logical extension of Batch systems– the CPU switches jobs 
so frequently that users can interact with each job while it is 
running, creating interactive computing
•
Response time should be < 1 second
•
Each user has at least one program executing in memory 
process
•
If several jobs ready to run at the same time CPU 
scheduling
•
If processes don’t fit in memory, swapping moves them 
in and out to run
•
Virtual memory allows execution of processes not 
completely in memory


## Slide 30

1.31
Memory Layout for Multiprogrammed System


## Slide 31

1.32
Dual-mode Operation
▪
Dual-mode operation allows OS to protect itself and other 
system components
•
User mode and kernel mode 
▪
Mode bit provided by hardware 
•
Provides ability to distinguish when system is running user 
code or kernel code.
•
When a user is running mode bit is “user”
•
When kernel code is executing mode bit is “kernel”
▪
How do we guarantee that user does not explicitly set the mode 
bit to “kernel”?
•
System call changes mode to kernel, return from call resets 
it to user
▪
Some instructions designated as privileged, only executable in 
kernel mode


## Slide 32

1.33
Transition from User to Kernel Mode
▪
Timer to prevent infinite loop / process hogging resources
•
Timer is set to interrupt the computer after some time period
•
Keep a counter that is decremented by the physical clock
•
Operating system set the counter (privileged instruction)
•
When counter zero generate an interrupt
•
Set up before scheduling process to regain control or terminate 
program that exceeds allotted time


## Slide 33

1.34
Process Management
▪
A process is a program in execution. It is a unit of work within the 
system. Program is a passive entity; process is an active entity.
▪
Process needs resources to accomplish its task
•
CPU, memory, I/O, files
•
Initialization data
▪
Process termination requires reclaim of any reusable resources
▪
Single-threaded process has one program counter specifying location 
of next instruction to execute
•
Process executes instructions sequentially, one at a time, until 
completion
▪
Multi-threaded process has one program counter per thread
▪
Typically system has many processes, some user, some operating 
system running concurrently on one or more CPUs
•
Concurrency by multiplexing the CPUs among the processes / 
threads


## Slide 34

1.35
Process Management Activities
▪
Creating and deleting both user and system processes
▪
Suspending and resuming processes
▪
Providing mechanisms for process synchronization
▪
Providing mechanisms for process communication
▪
Providing mechanisms for deadlock handling
The operating system is responsible for the following activities in 
connection with process management:


## Slide 35

1.36
Memory Management
▪
To execute a program all (or part) of the instructions must be in 
memory
▪
All  (or part) of the data that is needed by the program must be in 
memory
▪
Memory management determines what is in memory and when
•
Optimizing CPU utilization and computer response to users
▪
Memory management activities
•
Keeping track of which parts of memory are currently being used 
and by whom
•
Deciding which processes (or parts thereof) and data to move into 
and out of memory
•
Allocating and deallocating memory space as needed


## Slide 36

1.37
File-system Management
▪
OS provides uniform, logical view of information storage
•
Abstracts physical properties to logical storage unit  - file
•
Each medium is controlled by device (i.e., disk drive, tape drive)
Varying properties include access speed, capacity, data-
transfer rate, access method (sequential or random)
▪
File-System management
•
Files usually organized into directories
•
Access control on most systems to determine who can access 
what
•
OS activities include
Creating and deleting files and directories
Primitives to manipulate files and directories
Mapping files onto secondary storage
Backup files onto stable (non-volatile) storage media


## Slide 37

1.38
Mass-Storage Management
▪
Usually disks used to store data that does not fit in main 
memory or data that must be kept for a “long” period of time
▪
Proper management is of central importance
▪
Entire speed of computer operation hinges on disk subsystem 
and its algorithms
▪
OS activities
•
Mounting and unmounting
•
Free-space management
•
Storage allocation
•
Disk scheduling
•
Partitioning
•
Protection


## Slide 38

1.39
Caching
▪
Important principle, performed at many levels in a computer 
(in hardware, operating system, software)
▪
Information in use copied from slower to faster storage 
temporarily
▪
Faster storage (cache) checked first to determine if 
information is there
•
If it is, information used directly from the cache (fast)
•
If not, data copied to cache and used there
▪
Cache smaller than storage being cached
•
Cache management important design problem
•
Cache size and replacement policy


## Slide 48

1.49
Computer System Architecture


## Slide 55

1.56
Computer System Environments


## Slide 56

1.57
Computing Environments
▪
Traditional
▪
Mobile
▪
Client Server
▪
Peer-to-Peer
▪
Cloud computing
▪
Real-time Embedded


## Slide 57

1.58
Traditional
▪
Stand-alone general-purpose machines
▪
But blurred as most systems interconnect with others (i.e., 
the Internet)
▪
Portals provide web access to internal systems
▪
Network computers (thin clients) are like Web terminals
▪
Mobile computers interconnect via wireless networks
▪
Networking becoming ubiquitous – even home systems 
use firewalls to protect home computers from Internet 
attacks


## Slide 58

1.59
Mobile
▪
Handheld smartphones, tablets, etc.
▪
What is the functional difference between them and a 
“traditional” laptop?
▪
Extra feature – more OS features (GPS, gyroscope)
▪
Allows new types of apps like augmented reality
▪
Use IEEE 802.11 wireless, or cellular data networks for 
connectivity
▪
Leaders are Apple iOS and Google Android


## Slide 59

1.60
Client Server
▪
Client-Server Computing
•
Dumb terminals supplanted by smart PCs
•
Many systems now servers, responding to requests generated by 
clients
Compute-server system provides an interface to client to 
request services (i.e., database)
File-server system provides interface for clients to store and 
retrieve files


## Slide 60

1.61
Peer-to-Peer
▪
Another model of distributed system
▪
P2P does not distinguish clients and servers
•
Instead all nodes are considered peers
•
May each act as client, server or both
•
Node must join P2P network
Registers its service with central 
lookup service on network, or
Broadcast request for service and 
respond to requests for service via 
discovery protocol
•
Examples include Napster and Gnutella, 
Voice over IP (VoIP) such as Skype


## Slide 62

1.63
Cloud Computing (Cont.)
▪
Many types
•
Public cloud – available via Internet to anyone willing to pay
•
Private cloud – run by a company for the company’s own use
•
Hybrid cloud – includes both public and private cloud components
•
Software as a Service (SaaS) – one or more applications available 
via the Internet (i.e., word processor)
•
Platform as a Service (PaaS) – software stack ready for application 
use via the Internet (i.e., a database server)
•
Infrastructure as a Service (IaaS) – servers or storage available 
over Internet (i.e., storage available for backup use)


## Slide 64

1.65
Real-Time Embedded Systems
▪
Real-time embedded systems most prevalent form of computers
•
Vary considerable, special purpose, limited purpose OS,  real-
time OS
•
Use expanding
▪
Many other special computing environments as well
•
Some have OSes, some perform tasks without an OS
▪
Real-time OS has well-defined fixed time constraints
•
Processing must be done within constraint
•
Correct operation only if constraints met


## Slide 66

1.67
Kernel Data Structure


## Slide 71

End of Chapter 1
