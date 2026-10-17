# Chapter 5 — in-scope slide text

Source: `sources/syllabus/CH-5-Updated.pdf`. Slides marked with a green X are excluded.


**Excluded slides (16):** 5, 28, 29, 30, 35, 36, 37, 38, 39, 41, 43, 44, 45, 46, 47, 48


## Slide 1

Chapter 5:  CPU Scheduling


## Slide 2

5.2
Chapter 5:  CPU Scheduling

Basic Concepts

Scheduling Criteria 

Scheduling Algorithms

Thread Scheduling

Multi-Processor Scheduling

Real-Time CPU Scheduling

Operating Systems Examples

Algorithm Evaluation


## Slide 3

5.3
Objectives

Describe various CPU scheduling algorithms

Assess CPU scheduling algorithms based on scheduling criteria

Explain the issues related to multiprocessor and multicore 
scheduling

Describe various real-time scheduling algorithms

Describe the scheduling algorithms used in the Windows, Linux, 
and Solaris operating systems

Apply modeling and simulations to evaluate CPU scheduling 
algorithms


## Slide 4

5.4
Basic Concepts

Maximum CPU utilization 
obtained with multiprogramming

CPU–I/O Burst Cycle – Process 
execution consists of a cycle of 
CPU execution and I/O wait

CPU burst followed by I/O burst

CPU burst distribution is of main 
concern


## Slide 6

5.6
CPU Scheduler

The CPU scheduler selects from among the processes in ready 
queue, and allocates the a CPU core to one of them
Queue may be ordered in various ways

CPU scheduling decisions may take place when a process:
1. Switches from running to waiting state
2. Switches from running to ready state
3. Switches from waiting to ready
4. Terminates

Scheduling under 1 and 4 is nonpreemptive

All other scheduling is preemptive
Consider access to shared data
Consider preemption while in kernel mode
Consider interrupts occurring during crucial OS activities


## Slide 7

5.7
Dispatcher

Dispatcher module gives control of the CPU to 
the process selected by the short-term 
scheduler; this involves:
switching context
switching to user mode
jumping to the proper location in the user 
program to restart that program

Dispatch latency – time it takes for the 
dispatcher to stop one process and start 
another running


## Slide 8

5.8
Scheduling Criteria

CPU utilization – keep the CPU as busy as possible

Throughput – # of processes that complete their execution per 
time unit

Turnaround time – amount of time to execute a particular 
process

Waiting time – amount of time a process has been waiting in the 
ready queue

Response time – amount of time it takes from when a request 
was submitted until the first response is produced, not output  (for 
time-sharing environment)


## Slide 9

5.9
Scheduling Algorithm Optimization Criteria

Max CPU utilization

Max throughput

Min turnaround time 

Min waiting time 

Min response time


## Slide 10

5.10
First- Come, First-Served (FCFS) Scheduling
Process
Burst Time
 P1
24
 P2 
3
 P3
 3 

Suppose that the processes arrive in the order: P1 , P2 , P3  
The Gantt Chart for the schedule is:

Waiting time for P1  = 0; P2  = 24; P3 = 27

Average waiting time:  (0 + 24 + 27)/3 = 17
P
P
P
1
2
3
0
24
30
27


## Slide 11

5.11
FCFS Scheduling (Cont.)
Suppose that the processes arrive in the order:
 P2 , P3 , P1 

The Gantt chart for the schedule is:

Waiting time for P1 = 6; P2 = 0; P3 = 3

Average waiting time:   (6 + 0 + 3)/3 = 3

Much better than previous case

Convoy effect - short process behind long process
Consider one CPU-bound and many I/O-bound processes
P1
0
3
6
30
P2
P3


## Slide 12

5.12
Shortest-Job-First (SJF) Scheduling

Associate with each process the length of its next CPU burst
 Use these lengths to schedule the process with the shortest 
time

SJF is optimal – gives minimum average waiting time for a given 
set of processes
The difficulty is knowing the length of the next CPU request
Could ask the user


## Slide 13

5.13
Example of SJF
                      ProcessArriva l Time
Burst Time
             P1
0.0
6
            P2 
2.0
8
            P3
4.0
7
            P4
5.0
3

SJF scheduling chart

Average waiting time = (3 + 16 + 9 + 0) / 4 = 7
P3
0
3
24
P 4
P 1
16
9
P2


## Slide 14

5.14
Example of Shortest-remaining-time-first

Can only estimate the length – should be similar to the previous one
Then pick process with shortest predicted next CPU burst

Preemptive version called shortest-remaining-time-first

Now we add the concepts of varying arrival times and preemption to the 
analysis
         ProcessA
arri Arrival TimeT
Burst Time
 P1
0
8
 P2 
1
4
 P3
2
9
 P4
3
5

Preemptive SJF Gantt Chart

Average waiting time = [(10-1)+(1-1)+(17-2)+5-3)]/4 = 26/4 = 6.5 msec
P4
0
1
26
P1
P 2
10
P3
P1
5
17


## Slide 15

5.15
Round Robin (RR)

Each process gets a small unit of CPU time (time quantum q), 
usually 10-100 milliseconds.  After this time has elapsed, the 
process is preempted and added to the end of the ready queue.

If there are n processes in the ready queue and the time 
quantum is q, then each process gets 1/n of the CPU time in 
chunks of at most q time units at once.  No process waits more 
than (n-1)q time units.

Timer interrupts every quantum to schedule next process

Performance
q large  FIFO
q small  q must be large with respect to context switch, 
otherwise overhead is too high


## Slide 16

5.16
Example of RR with Time Quantum = 4
Process
Burst Time
P1
24
 P2
 3
 P3
3

The Gantt chart is: 

Typically, higher average turnaround than SJF, but better 
response

q should be large compared to context switch time

q usually 10ms to 100ms, context switch < 10 usec
P
P
P
1
1
1
0
18
30
26
14
4
7
10
22
P2
P3
P1
P1
P1


## Slide 17

5.17
Time Quantum and Context Switch Time


## Slide 18

5.18
Turnaround Time Varies With The Time Quantum
80% of CPU bursts should 
be shorter than q


## Slide 19

5.19
Priority Scheduling

A priority number (integer) is associated with each process

The CPU is allocated to the process with the highest priority 
(smallest integer  highest priority)
Preemptive
Nonpreemptive

SJF is priority scheduling where priority is the inverse of predicted 
next CPU burst time

Problem  Starvation – low priority processes may never execute

Solution  Aging – as time progresses increase the priority of the 
process


## Slide 20

5.20
Example of Priority Scheduling
         ProcessA arri Burst TimeT
Priority
 P1
10
3
 P2 
1
1
 P3
2
4
 P4
1
5
P5
5
2

Priority scheduling Gantt Chart

Average waiting time = 8.2 msec


## Slide 21

5.21
Priority Scheduling w/ Round-Robin
         ProcessA arri Burst TimeT
Priority
 P1
4
3
 P2 
5
2
 P3
8
2
 P4
7
1
P5
3
3
Run the process with the highest priority. Processes with the same priority 
run round-robin

Gantt Chart wit 2 ms time quantum


## Slide 22

5.22
Multilevel Queue

The ready queue consists of multiple queues

Multilevel queue scheduler defined by the following parameters:
Number of queues
Scheduling algorithms for each queue
Method used to determine which queue a process will enter 
when that process needs service
Scheduling among the queues


## Slide 23

5.23
Multilevel Queue

With priority scheduling, have separate queues for each priority.

Schedule the process in the highest-priority queue!


## Slide 24

5.24
Multilevel Queue

Prioritization based upon process type


## Slide 25

5.25
Multilevel Feedback Queue

A process can move between the various queues.

Multilevel-feedback-queue scheduler defined by the following 
parameters:
Number of queues
Scheduling algorithms for each queue
Method used to determine when to upgrade a process
Method used to determine when to demote a process
Method used to determine which queue a process will enter 
when that process needs service

Aging can be implemented using multilevel feedback queue


## Slide 26

5.26
Example of Multilevel Feedback Queue

Three queues: 

Q0 – RR with time quantum 8 milliseconds

Q1 – RR time quantum 16 milliseconds

Q2 – FCFS

Scheduling

A new process enters queue Q0 which is 
served in RR
When it gains CPU, the process receives 8 
milliseconds
If it does not finish in 8 milliseconds, the 
process  is moved to queue Q1

At Q1 job is again served in RR and 
receives 16 additional milliseconds
If it still does not complete, it is preempted 
and moved to queue Q2


## Slide 27

5.27
Thread Scheduling

Distinction between user-level and kernel-level threads

When threads supported, threads scheduled, not processes

Many-to-one and many-to-many models, thread library schedules 
user-level threads to run on LWP
Known as process-contention scope (PCS) since scheduling 
competition is within the process
Typically done via priority set by programmer

Kernel thread scheduled onto available CPU is system-contention 
scope (SCS) – competition among all threads in system


## Slide 31

5.31
Multiple-Processor Scheduling

CPU scheduling more complex when multiple CPUs are 
available

Multiprocess may be any one of the following architectures:
Multicore CPUs
Multithreaded cores


## Slide 32

5.32
Multiple-Processor Scheduling

Symmetric multiprocessing (SMP) is where each processor is self 
scheduling.

All threads may be in a common ready queue (a)

Each processor may have its own private queue of threads (b)


## Slide 33

5.33
Multicore Processors

Recent trend to place multiple processor cores on same 
physical chip

Faster and consumes less power

Multiple threads per core also growing
Takes advantage of memory stall to make progress on 
another thread while memory retrieve happens


## Slide 34

5.34
Multithreaded Multicore System
Each core has > 1 hardware threads. 
If one thread has a memory stall, switch to another thread!


## Slide 40

5.40
Operating System Examples

Linux scheduling

Windows scheduling


## Slide 42

5.42
Windows Scheduling

Windows uses priority-based preemptive scheduling

Highest-priority thread runs next

Dispatcher is scheduler


## Slide 49

5.49
Some Definitions and Formulas

For priority – the smallest is the highest priority.

Arrival Time: Time at which the process arrives in the ready queue.

Burst Time: Time required by a process for CPU execution.

Completion Time: Time at which process completes its execution.

Response time – amount of time it takes from when a request was submitted until the 
first response is produced, not output.

Turn Around Time: Time Difference between completion time and arrival time.

 Turn Around Time = Completion Time – Arrival Time

Waiting Time (W.T): Time Difference between turnaround time and burst time.

Waiting Time = Turn Around Time – Burst Time

Throughput: The number of processes executed by the CPU in a given amount of 
time.

Throughput =number of processes completed /total execution time


## Slide 50

End of Chapter 5
