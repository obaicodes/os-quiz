# نطاق المقرر: الاختبار النصفي الأول

> **الحالة:** ✅ معتمد من صاحب المشروع (2026-10-18).
> **المرجع:** ملفات `sources/syllabus/CH-*-Updated.pdf`. أي شريحة عليها علامة X خضراء مستبعدة.
> **طريقة الاستبعاد:** كُشفت العلامة آلياً من لونها، ثم رُوجعت كل الشرائح بصرياً، والنتيجتان متطابقتان.
> **نص الشرائح المقررة:** `data/syllabus/ch1.md` … `ch5.md`
> **قائمة المستبعد بصيغة آلية:** `data/syllabus/excluded_slides.json`

## ملخص

| الوحدة | العنوان | عدد الشرائح | المستبعد | المقرر |
|---|---|---|---|---|
| 1 | Introduction | 71 | 22 | 49 |
| 2 | Operating-System Structures | 45 | 7 | 38 |
| 3 | Processes | 40 | 13 | 27 |
| 4 | Threads & Concurrency | 34 | 8 | 26 |
| 5 | CPU Scheduling | 50 | 16 | 34 |

أرقام الشرائح أدناه هي **رقم الصفحة في ملف PDF**. في الوحدة الأولى فقط يختلف الرقم المكتوب أسفل الشريحة عن رقم الصفحة بواحد، ابتداءً من الصفحة 19. مثلاً الصفحة 19 مكتوب عليها 1.20.

---

## Chapter 1: Introduction

**المقرر:**
- **What an OS is (4–9):** تعريف OS وأهدافه، المكونات الأربعة لنظام الحاسب، وجهات النظر (user / system)، kernel / system program / application program، middleware.
- **Computer-System Organization (10–16):** device controllers، local buffer، device driver، interrupts، interrupt vector، trap/exception، interrupt handling.
- **I/O Structure (17–18):** طريقتا التعامل مع I/O (synchronous / asynchronous)، device-status table.
- **Storage (19–24):** main memory (DRAM, volatile)، secondary storage، HDD (tracks/sectors)، NVM، bit/byte/word/KB…PB، storage hierarchy (speed / cost / volatility)، caching، device driver.
- **Von Neumann / DMA (25–26):** Direct Memory Access.
- **OS Operations (27–32):** bootstrap program، system daemons، hardware/software interrupts، multiprogramming (batch)، multitasking (timesharing)، dual-mode (user/kernel, mode bit)، privileged instructions، timer.
- **Resource Management (33–37):** process management وأنشطته، memory management، file-system management، mass-storage management.
- **Caching (38).**
- **Computing Environments (56–60, 62, 64):** traditional، mobile، client-server (compute-server / file-server)، peer-to-peer، أنواع cloud (public / private / hybrid، SaaS / PaaS / IaaS)، real-time embedded systems.

**المستبعد:** 39–47 (جدول خصائص التخزين، migration of data، protection & security، virtualization، distributed systems، cloud computing (45, 46)، real-time (47))، 49–54 (computer-system architecture: multiprocessors، SMP، dual-core، NUMA، clustered systems)، 61 (cloud computing intro)، 63 (cloud cont.)، 65 (study of OS)، 67–70 (kernel data structures، free/open-source OS).

> ⚠️ **ملاحظة:** بعض المواضيع مستبعدة في شريحة ومقررة في شريحة أخرى. مثلاً Cloud Computing مستبعد في 45, 46, 61, 63، لكن الشريحة 62 (أنواع cloud) غير مستبعدة. وReal-time مستبعد في 47 ومقرر في 64. **القرار المعتمد:** الحكم للشريحة نفسها وليس للموضوع. مثلاً من Cloud Computing لا يدخل في المقرر إلا محتوى الشريحة 62.

---

## Chapter 2: Operating-System Structures

**المقرر:**
- **OS Services (4–7):** الخدمات الموجهة للمستخدم (UI, program execution, I/O, file-system, communications, error detection) والخدمات الموجهة لكفاءة النظام (resource allocation, logging, protection & security).
- **User Interfaces (8–10):** CLI (shells)، GUI، touchscreen.
- **System Calls (11–23):** API (Win32, POSIX, Java)، system-call interface، parameter passing (registers / table / stack)، أنواع system calls الستة، أمثلة Windows/Unix، Standard C library.
- **System Services (26–29).**
- **Linkers and Loaders (30–31).**
- **Implementation (35).**
- **OS Structure (36–40):** monolithic (original UNIX)، layered، modules (LKMs).
- **Booting (42, 44):** building an OS، system boot (bootstrap loader, BIOS, UEFI, GRUB).

**المستبعد:** 24 (Arduino)، 25 (FreeBSD)، 32 (why applications are OS specific)، 33 (design & implementation)، 34 (policy & mechanism)، 41 (hybrid systems)، 43 (building Linux).

---

## Chapter 3: Processes

**المقرر:**
- **Process Concept (4–7):** text / data / heap / stack، program vs process، memory layout of a C program.
- **Process State (8–9):** new, running, waiting, ready, terminated، ومخطط الانتقال بينها.
- **PCB (10)** و**Threads (11).**
- **Process Scheduling (13–18):** ready / wait queues، context switch، multitasking in mobile systems.
- **Operations on Processes (19–23):** process creation (tree, pid, fork/exec/wait)، process termination (exit, abort, cascading termination).
- **IPC (26–29):** independent vs cooperating، shared memory vs message passing، send/receive.

**المستبعد:** 12 (Linux task_struct)، 24 (Android hierarchy)، 25 (Chrome)، 30–39 (Windows ALPC، pipes، sockets، RPC، client-server communication).

---

## Chapter 4: Threads & Concurrency

**المقرر:**
- **Motivation & Benefits (4–7):** responsiveness، resource sharing، economy، scalability.
- **Multicore Programming (8–11):** التحديات الخمسة، concurrency vs parallelism، data vs task parallelism.
- **User & Kernel Threads (12–13).**
- **Multithreading Models (14–18):** many-to-one، one-to-one، many-to-many، two-level.
- **Thread Libraries (19–22):** Pthreads، Java threads.
- **Fork-Join (24–25).**
- **OS Examples (30):** شريحة عنوان فقط، ومحتواها (31–33) مستبعد.

**المستبعد:** 23 (implicit threading)، 26–27 (OpenMP)، 28–29 (threading issues, fork/exec semantics)، 31–33 (Windows / Linux threads).

---

## Chapter 5: CPU Scheduling

**المقرر:**
- **Basic Concepts (4, 6–9):** CPU–I/O burst cycle، CPU scheduler، preemptive / nonpreemptive، dispatcher & dispatch latency، scheduling criteria.
- **Algorithms (10–26):** FCFS (convoy effect)، SJF، SRTF، Round Robin (time quantum)، Priority (starvation / aging)، Priority + RR، Multilevel Queue، Multilevel Feedback Queue.
- **Thread Scheduling (27):** PCS vs SCS.
- **Multiple-Processor Scheduling (31–34):** SMP، common vs per-core ready queue، multicore، memory stall، multithreaded multicore.
- **Windows Scheduling (42).**
- **Definitions & Formulas (49):** arrival / burst / completion / turnaround / waiting / response time، throughput.

**المستبعد:** 5 (histogram)، 28–30 (Pthread scheduling)، 35 (load balancing)، 36–39 (real-time CPU scheduling)، 41 (Linux 2.5)، 43–48 (Windows priority classes، algorithm evaluation، Little's formula).

---

## ملاحظات المراجعة (`توزيع- الاسئلة والتحديد-3.txt`)

تختلف ملاحظات المراجعة عن علامات X في الوحدتين 1 و2.

**القرار المعتمد:**
- المرجع **دائماً** هو ملفات `Updated` وعلامات X فيها.
- الملاحظات تُستخدم لتحديد **أهمية** المواضيع فقط، ولا يُستبعد بها أي شيء.

---

## معلومات عن شكل الاختبار (من ملفات التوزيع)
- 12 سؤال اختيار من متعدد، لكل سؤال نصف درجة.
- 4 أسئلة مقالية بإجابة قصيرة، لكل سؤال درجة، وغالباً من الوحدتين 1 و2.
- سيناريو مقالي من سؤالين، لكل سؤال درجة.
- سؤال جدولة بـ 4 درجات: رسم Gantt chart وحساب average waiting time وturnaround time.
- مواضيع أكدت عليها الملفات: system calls، dual mode، خطوات الإقلاع (boot)، multithreading models (مع المزايا والعيوب)، PCB، وكل الوحدة 5.

> **لاحظ:** النسخة الأولى من الموقع اختيار من متعدد فقط، لكن سؤال الجدولة (4 درجات) هو الأعلى وزناً. أسئلة الجدولة الحسابية يمكن تحويلها لاختيار من متعدد، مثل: "ما متوسط وقت الانتظار؟" مع 4 خيارات رقمية.
