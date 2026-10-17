"""Discrete CPU-scheduling simulator used to build and verify Chapter 5 questions.

Algorithms: FCFS, SJF (nonpreemptive), SRTF (preemptive SJF), RR, PRIO (nonpreemptive
priority) and PPRIO (preemptive priority). Lower priority number = higher priority.

Tie rules (default, as stated in data/bank/README.md):
  * SJF / SRTF / PRIO / PPRIO: ties go to the earlier arrival, then to the process listed first.
    A running process is only preempted by a strictly better one.
  * RR: a process arriving at the same instant a time slice ends enters the ready queue
    before the preempted process.
`alt=True` flips both rules; it is used to detect questions whose answer depends on them.
"""


def simulate(procs, alg, q=None, alt=False):
    """procs: list of (name, arrival, burst[, priority]). Returns a dict with the schedule."""
    procs = [tuple(p) + (0,) * (4 - len(p)) for p in procs]
    order = {p[0]: i for i, p in enumerate(procs)}
    info = {n: {"a": a, "b": b, "p": pr, "r": b} for n, a, b, pr in procs}
    sign = -1 if alt else 1
    tie = lambda n: (info[n]["a"] * sign, order[n] * sign)
    key = {
        "SJF": lambda n: (info[n]["r"],) + tie(n),
        "SRTF": lambda n: (info[n]["r"],) + tie(n),
        "PRIO": lambda n: (info[n]["p"],) + tie(n),
        "PPRIO": lambda n: (info[n]["p"],) + tie(n),
    }.get(alg)

    t, ready, arrived, done, gantt = 0, [], set(), {}, []
    cur, slice_left = None, 0

    def admit(now):
        for n, *_ in sorted(procs, key=lambda p: (p[1], order[p[0]])):
            if n not in arrived and info[n]["a"] <= now:
                arrived.add(n)
                ready.append(n)

    admit(0)
    while len(done) < len(procs):
        if cur is None:
            if not ready:
                t += 1
                admit(t)
                continue
            cur = ready.pop(0) if alg in ("FCFS", "RR") else min(ready, key=key)
            if cur in ready:
                ready.remove(cur)
            slice_left = q
        if alg in ("SRTF", "PPRIO") and ready:
            best = min(ready, key=key)
            field = "r" if alg == "SRTF" else "p"
            if info[best][field] < info[cur][field]:
                ready.remove(best)
                ready.append(cur)
                cur = best
        if gantt and gantt[-1][0] == cur and gantt[-1][2] == t:
            gantt[-1][2] += 1
        else:
            gantt.append([cur, t, t + 1])
        info[cur]["r"] -= 1
        t += 1
        if alg == "RR":
            slice_left -= 1
        if info[cur]["r"] == 0:
            admit(t)
            done[cur] = t
            cur = None
        elif alg == "RR" and slice_left == 0:
            if alt:
                ready.append(cur)
                admit(t)
            else:
                admit(t)
                ready.append(cur)
            cur = None
        else:
            admit(t)

    names = [p[0] for p in procs]
    tat = {n: done[n] - info[n]["a"] for n in names}
    wt = {n: tat[n] - info[n]["b"] for n in names}
    start = {n: min(s for g, s, _ in gantt if g == n) for n in names}
    return {
        "gantt": [tuple(g) for g in gantt],
        "completion": done,
        "tat": tat,
        "wt": wt,
        "start": start,
        "avg_wt": sum(wt.values()) / len(names),
        "avg_tat": sum(tat.values()) / len(names),
        "order": [g[0] for g in gantt],
    }


def cpu_at(result, t0, t1):
    """What the CPU does during [t0, t1): a process name or 'idle'."""
    for name, s, e in result["gantt"]:
        if s <= t0 and t1 <= e:
            return name
    if all(e <= t0 or s >= t1 for _, s, e in result["gantt"]):
        return "idle"
    return None


def gantt_text(result):
    out, last = [], 0
    for name, s, e in result["gantt"]:
        if s > last:
            out.append(f"idle {last}-{s}")
        out.append(f"{name} {s}-{e}")
        last = e
    return ", ".join(out)
