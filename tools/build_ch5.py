"""Build data/bank/ch5.json.

ch5.json = hand-written concept questions (data/bank/src/ch5_concepts.json)
         + hand-written multilevel feedback queue questions (data/bank/src/ch5_mlfq.json)
         + numerical scheduling questions generated below, whose answers come from tools/sched.py.
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sched import cpu_at, gantt_text, simulate  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "bank", "src")
OUT = os.path.join(ROOT, "data", "bank", "ch5.json")

# ---------------------------------------------------------------- datasets
# (name, arrival, burst[, priority])
D = {
    "L01": [("P1", 0, 20), ("P2", 3, 7), ("P3", 5, 2), ("P4", 7, 3)],
    "L03": [("Pa", 0, 8), ("Pb", 0, 5), ("Pc", 0, 1), ("Pd", 0, 6)],
    "L04": [("P1", 0, 10, 3), ("P2", 0, 1, 1), ("P3", 0, 2, 3), ("P4", 0, 1, 4), ("P5", 0, 5, 2)],
    "L06": [("P1", 2, 7), ("P2", 5, 3), ("P3", 6, 2)],
    "L08a": [("P1", 0, 7, 0), ("P2", 2, 4, 1), ("P3", 4, 1, 2), ("P4", 5, 4, 3)],
    "L08b": [("P1", 10, 7), ("P2", 4, 3), ("P3", 2, 8), ("P4", 6, 6)],
    "L09a": [("P1", 0, 20), ("P2", 0, 10), ("P3", 0, 5)],
    "L09b": [("P1", 0, 14), ("P2", 4, 8), ("P3", 8, 2), ("P4", 10, 8)],
    "L09c": [("P1", 1, 7), ("P2", 2, 5), ("P3", 3, 1), ("P4", 4, 2), ("P5", 5, 8)],
    "L09d": [("P1", 0, 5, 2), ("P2", 4, 8, 1), ("P3", 6, 2, 4), ("P4", 8, 6, 3)],
    "L10": [("P1", 0, 8), ("P2", 1, 5), ("P3", 2, 3), ("P4", 3, 4)],
    "L11": [("P1", 0, 8), ("P2", 0, 6), ("P3", 0, 1), ("P4", 0, 9)],
    "L13a": [("P1", 0, 4), ("P2", 1, 3), ("P3", 2, 3)],
    "L13b": [("P1", 0, 4), ("P2", 6, 3), ("P3", 6, 2)],
    "L13c": [("P1", 2, 4), ("P2", 7, 8), ("P3", 9, 1)],
    "L13d": [("P1", 0, 5, 4), ("P2", 1, 3, 2), ("P3", 2, 3, 1)],
    "L13e": [("P1", 0, 5), ("P2", 1, 8), ("P3", 2, 2)],
    "L14a": [("P1", 10, 15, 6), ("P2", 15, 5, 3), ("P3", 20, 10, 2)],
    "L14b": [("P1", 1, 3), ("P2", 2, 3), ("P3", 3, 3)],
    "L14c": [("P1", 0, 11), ("P2", 6, 7), ("P3", 8, 4)],
    "L14d": [("P1", 3, 11), ("P2", 6, 5), ("P3", 8, 4)],
    "L14e": [("P1", 0, 2, 2), ("P2", 0, 1, 1), ("P3", 0, 8, 4), ("P4", 0, 4, 2), ("P5", 0, 5, 3)],
    "L14f": [("P1", 0, 6, 2), ("P2", 1, 8, 1), ("P3", 2, 7, 4), ("P4", 3, 3, 2)],
    "L14g": [("P1", 0, 4), ("P2", 1, 3), ("P3", 2, 1)],
    "L15a": [("P1", 0, 5), ("P2", 0, 6), ("P3", 0, 7), ("P4", 0, 8), ("P5", 0, 9)],
    "L15b": [("P1", 0, 5), ("P2", 1, 5), ("P3", 2, 4), ("P4", 3, 3)],
    "L16": [("P1", 0, 4), ("P2", 1, 5), ("P3", 2, 2), ("P4", 4, 3)],
    "L17": [("P1", 0, 6), ("P2", 1, 3), ("P3", 2, 3), ("P4", 4, 5)],
    "L18a": [("P1", 0, 6), ("P2", 2, 2), ("P3", 3, 1)],
    "L18b": [("P1", 3, 11, 7), ("P2", 6, 5, 9), ("P3", 8, 4, 3)],
    "L18c": [("P1", 1, 5), ("P2", 3, 2), ("P3", 5, 1)],
    "L18d": [("P1", 0, 3), ("P2", 2, 2), ("P3", 3, 3)],
    "L18e": [("P1", 2, 6, 3), ("P2", 5, 2, 2), ("P3", 6, 4, 1)],
    # slide examples (CH-5 slides 10, 11, 13, 14, 16, 20)
    "S10": [("P1", 0, 24), ("P2", 0, 3), ("P3", 0, 3)],
    "S11": [("P2", 0, 3), ("P3", 0, 3), ("P1", 0, 24)],
    "S13": [("P1", 0, 6), ("P2", 0, 8), ("P3", 0, 7), ("P4", 0, 3)],
    "S14": [("P1", 0, 8), ("P2", 1, 4), ("P3", 2, 9), ("P4", 3, 5)],
    "S20": [("P1", 0, 10, 3), ("P2", 0, 1, 1), ("P3", 0, 2, 4), ("P4", 0, 1, 5), ("P5", 0, 5, 2)],
    # new practice sets in the same style
    "G1": [("P1", 0, 5), ("P2", 2, 3), ("P3", 4, 1), ("P4", 6, 2)],
    "G2": [("P1", 0, 7, 3), ("P2", 1, 4, 1), ("P3", 3, 2, 2), ("P4", 5, 3, 4)],
    "G3": [("P1", 0, 6), ("P2", 1, 4), ("P3", 3, 2), ("P4", 5, 3)],
    "G4": [("P1", 1, 6), ("P2", 2, 2), ("P3", 4, 8), ("P4", 5, 3)],
}

# (dataset, algorithm, quantum, question type, refs, options)
# question types: avg_wt, avg_tat, wt:P, tat:P, finish:P, start:P, order, cpu:t0-t1
SPECS = [
    ("L01", "FCFS", None, "avg_wt", ["L01-17"], {}),
    ("L01", "SRTF", None, "avg_wt", ["L01-17"], {}),
    ("L01", "SRTF", None, "order", ["L01-17"], {}),
    ("L03", "SJF", None, "avg_wt", ["L03-18"], {}),
    ("L03", "RR", 5, "avg_wt", ["L03-18"], {}),
    ("L04", "PRIO", None, "avg_wt", ["L04-30"], {}),
    ("L06", "FCFS", None, "order", ["L06-03"], {}),
    ("L06", "FCFS", None, "wt:P3", ["L06-04"], {}),
    ("L06", "SRTF", None, "order", ["L06-05"], {}),
    ("L06", "SRTF", None, "wt:P1", ["L06-06"], {}),
    ("L06", "SRTF", None, "finish:P3", ["L06-07"], {}),
    ("L08a", "RR", 2, "avg_wt", ["L08-30"], {}),
    ("L08a", "PPRIO", None, "order", ["L08-30"], {}),
    ("L08b", "SRTF", None, "avg_tat", ["L08-31"], {}),
    ("L09a", "SJF", None, "order", ["L09-04"], {}),
    ("L09a", "SJF", None, "avg_wt", ["L09-05"], {"none": True}),
    ("L09b", "SJF", None, "order", ["L09-06"], {}),
    ("L09c", "SJF", None, "order", ["L09-11"], {}),
    ("L09c", "SJF", None, "avg_wt", ["L09-12"], {}),
    ("L09c", "FCFS", None, "avg_wt", ["L09-13"], {}),
    ("L09d", "PPRIO", None, "order", ["L09-14"], {}),
    ("L09d", "PRIO", None, "avg_wt", ["L09-15"], {}),
    ("L10", "RR", 4, "avg_wt", ["L10-03"], {}),
    ("L10", "SJF", None, "order", ["L10-03"], {}),
    ("L11", "SJF", None, "avg_wt", ["L11-16"], {}),
    ("L11", "SJF", None, "avg_tat", ["L11-16"], {}),
    ("L11", "RR", 3, "avg_tat", ["L11-16"], {}),
    ("L11", "RR", 3, "avg_wt", ["L11-16"], {}),
    ("L13a", "SJF", None, "cpu:4-6", ["L13-02"], {}),
    ("L13b", "SJF", None, "cpu:4-6", ["L13-03"], {}),
    ("L13b", "SJF", None, "wt:P2", ["L13-04"], {}),
    ("L13c", "RR", 4, "cpu:6-7", ["L13-08"], {}),
    ("L13d", "PPRIO", None, "order", ["L13-09"], {}),
    ("L13d", "PRIO", None, "wt:P2", ["L14-22"], {}),
    ("L13e", "RR", 4, "order", ["L13-10"], {}),
    ("L14a", "PRIO", None, "wt:P2", ["L14-01"], {}),
    ("L14a", "PRIO", None, "finish:P2", ["L14-02"], {}),
    ("L14a", "PRIO", None, "order", ["L18-39"], {}),
    ("L14b", "FCFS", None, "avg_wt", ["L14-06"], {}),
    ("L14c", "FCFS", None, "finish:P3", ["L14-07"], {}),
    ("L14d", "SJF", None, "wt:P3", ["L14-08"], {"none": True}),
    ("L14d", "SJF", None, "start:P2", ["L18-35"], {}),
    ("L14e", "FCFS", None, "avg_wt", ["L14-15"], {}),
    ("L14e", "SJF", None, "avg_wt", ["L14-15"], {}),
    ("L14e", "PRIO", None, "avg_wt", ["L14-15"], {}),
    ("L14f", "SJF", None, "wt:P2", ["L14-16"], {}),
    ("L14f", "SJF", None, "order", ["L14-17"], {}),
    ("L14f", "SJF", None, "wt:P3", ["L14-18"], {}),
    ("L14f", "PPRIO", None, "avg_wt", ["L14-19"], {}),
    ("L14g", "SRTF", None, "order", ["L14-23"], {}),
    ("L14g", "SRTF", None, "wt:P1", ["L14-24"], {}),
    ("L15a", "RR", 9, "avg_wt", ["L15-22"], {}),
    ("L15b", "SRTF", None, "wt:P2", ["L15-24"], {}),
    ("L15b", "SJF", None, "order", ["L15-25"], {}),
    ("L15b", "FCFS", None, "avg_wt", ["L15-26"], {}),
    ("L16", "RR", 2, "avg_wt", ["L16-25"], {}),
    ("L17", "RR", 2, "avg_wt", ["L17-23"], {}),
    ("L18a", "SRTF", None, "start:P3", ["L18-33"], {}),
    ("L18b", "PPRIO", None, "cpu:8-9", ["L18-34"], {}),
    ("L18c", "FCFS", None, "order", ["L18-36"], {}),
    ("L18d", "FCFS", None, "avg_wt", ["L18-37"], {}),
    ("L18e", "PRIO", None, "avg_wt", ["L18-38"], {}),
    ("S10", "FCFS", None, "avg_wt", [], {}),
    ("S11", "FCFS", None, "avg_wt", [], {}),
    ("S13", "SJF", None, "avg_wt", [], {}),
    ("S14", "SRTF", None, "avg_wt", [], {}),
    ("S10", "RR", 4, "avg_wt", [], {}),
    ("S20", "PRIO", None, "avg_wt", [], {}),
    ("G1", "SRTF", None, "avg_wt", [], {}),
    ("G1", "RR", 2, "finish:P1", [], {}),
    ("G2", "PPRIO", None, "avg_tat", [], {}),
    ("G2", "PRIO", None, "order", [], {}),
    ("G3", "RR", 3, "avg_wt", [], {}),
    ("G3", "SRTF", None, "tat:P1", [], {}),
    ("G4", "FCFS", None, "cpu:0-1", [], {}),
    ("G4", "SJF", None, "avg_tat", [], {}),
]

ALG_TEXT = {
    "FCFS": "First-Come, First-Served (FCFS) scheduling",
    "SJF": "nonpreemptive Shortest-Job-First (SJF) scheduling",
    "SRTF": "preemptive SJF (Shortest-Remaining-Time-First) scheduling",
    "RR": "Round Robin (RR) scheduling with time quantum q = {q} ms",
    "PRIO": "nonpreemptive priority scheduling (a smaller number means a higher priority)",
    "PPRIO": "preemptive priority scheduling (a smaller number means a higher priority)",
}
ALG_HINT = {
    "FCFS": "Run the processes strictly in order of arrival; no process gives up the CPU early.",
    "SJF": "Each time the CPU becomes free, pick the arrived process with the shortest burst; no preemption.",
    "SRTF": "Re-check at every arrival: a process with a shorter remaining time takes the CPU.",
    "RR": "Each process runs at most one quantum and then goes to the back of the ready queue.",
    "PRIO": "Each time the CPU becomes free, pick the arrived process with the smallest priority number; no preemption.",
    "PPRIO": "A newly arrived process with a smaller priority number preempts the running process.",
}
SLIDES = {"FCFS": [10, 11, 49], "SJF": [12, 13, 49], "SRTF": [14, 49], "RR": [15, 16, 49],
          "PRIO": [19, 20, 49], "PPRIO": [19, 20, 49]}
TIE_NOTE = {
    "RR": " If a process arrives at the same moment a time slice ends, the arriving process enters the ready queue before the preempted one.",
    "other": " Ties are broken in favor of the process that arrived first (then the one listed first).",
}


def fmt(x):
    x = round(x, 2)
    return f"{int(x)} ms" if x == int(x) else f"{x:g} ms"


def value(res, qtype):
    kind, _, arg = qtype.partition(":")
    if kind == "avg_wt":
        return res["avg_wt"]
    if kind == "avg_tat":
        return res["avg_tat"]
    if kind == "wt":
        return res["wt"][arg]
    if kind == "tat":
        return res["tat"][arg]
    if kind == "finish":
        return res["completion"][arg]
    if kind == "start":
        return res["start"][arg]
    if kind == "order":
        return "-".join(res["order"])
    if kind == "cpu":
        t0, t1 = map(int, arg.split("-"))
        return cpu_at(res, t0, t1)
    raise ValueError(qtype)


def question_text(qtype):
    kind, _, arg = qtype.partition(":")
    if kind == "cpu":
        return "what does the CPU do from time {} to time {}?".format(*arg.split("-"))
    return {
        "avg_wt": "what is the average waiting time?",
        "avg_tat": "what is the average turnaround time?",
        "wt": f"what is the waiting time of {arg}?",
        "tat": f"what is the turnaround time of {arg}?",
        "finish": f"at what time does {arg} finish execution?",
        "start": f"at what time does {arg} start execution (first get the CPU)?",
        "order": "what is the order of execution shown on the Gantt chart?",
    }[kind]


def other_results(procs, alg):
    algs = ["FCFS", "SJF", "SRTF", ("RR", 2), ("RR", 3), ("RR", 4)]
    if len(procs[0]) == 4:
        algs += ["PRIO", "PPRIO"]
    out = []
    for a in algs:
        name, q = (a, None) if isinstance(a, str) else a
        if name == alg:
            continue
        out.append(simulate(procs, name, q))
    return out


def numeric_distractors(correct, res, procs, alg, qtype, rng):
    kind, _, arg = qtype.partition(":")
    pool = [value(r, qtype) for r in other_results(procs, alg)]
    if kind == "avg_wt":
        pool += [res["avg_tat"], sum(res["wt"].values()),
                 sum(res["start"][p[0]] - p[1] for p in procs) / len(procs)]
    elif kind == "avg_tat":
        pool += [res["avg_wt"], sum(res["tat"].values())]
    elif kind in ("wt", "tat"):
        other = "tat" if kind == "wt" else "wt"
        pool += [res[other][arg], res["start"][arg] - dict((p[0], p[1]) for p in procs)[arg]]
        pool += [res[kind][p[0]] for p in procs if p[0] != arg]
    elif kind in ("finish", "start"):
        pool += [res["completion"][p[0]] for p in procs] + [res["start"][p[0]] for p in procs]
    rng.shuffle(pool)
    step = 0.5 if kind.startswith("avg") else 1
    pool += [correct + d * step for d in (1, -1, 2, -2, 3, 4)]
    seen, picks = {fmt(correct)}, []
    for v in pool:
        if v is None or v < 0 or fmt(v) in seen:
            continue
        if v == 0 and kind in ("finish", "tat", "avg_tat"):
            continue
        seen.add(fmt(v))
        picks.append(fmt(v))
        if len(picks) == 3:
            break
    return picks


def order_distractors(correct, procs, alg, rng):
    pool = ["-".join(r["order"]) for r in other_results(procs, alg)]
    names = correct.split("-")
    for _ in range(40):
        cand = names[:]
        i = rng.randrange(len(cand) - 1)
        cand[i], cand[i + 1] = cand[i + 1], cand[i]
        pool.append("-".join(cand))
        pool.append("-".join(dict.fromkeys(names)))
    rng.shuffle(pool)
    seen, picks = {correct}, []
    for v in pool:
        if v not in seen and all(a != b for a, b in zip(v.split("-"), v.split("-")[1:])):
            seen.add(v)
            picks.append(v)
        if len(picks) == 3:
            break
    return picks


def cpu_options(correct, procs, rng):
    label = lambda v: "The CPU is idle" if v == "idle" else f"The CPU is executing {v}"
    others = [p[0] for p in procs if p[0] != correct] + (["idle"] if correct != "idle" else [])
    rng.shuffle(others)
    if "idle" in others:
        others.remove("idle")
        others = ["idle"] + others
    return label(correct), [label(v) for v in others[:3]]


def explain(res, procs, alg, q, qtype, correct_text):
    kind, _, arg = qtype.partition(":")
    arr = {p[0]: p[1] for p in procs}
    burst = {p[0]: p[2] for p in procs}
    s = f"Gantt chart: {gantt_text(res)}. "
    if kind in ("avg_wt", "wt"):
        names = [arg] if kind == "wt" else [p[0] for p in procs]
        parts = [f"WT({n}) = ({res['completion'][n]} - {arr[n]}) - {burst[n]} = {res['wt'][n]}" for n in names]
        s += "Waiting time = turnaround time - burst time, where turnaround time = completion time - arrival time. " + "; ".join(parts) + "."
        if kind == "avg_wt":
            s += f" Average = {sum(res['wt'].values())}/{len(procs)} = {correct_text}."
    elif kind in ("avg_tat", "tat"):
        names = [arg] if kind == "tat" else [p[0] for p in procs]
        parts = [f"TAT({n}) = {res['completion'][n]} - {arr[n]} = {res['tat'][n]}" for n in names]
        s += "Turnaround time = completion time - arrival time. " + "; ".join(parts) + "."
        if kind == "avg_tat":
            s += f" Average = {sum(res['tat'].values())}/{len(procs)} = {correct_text}."
    elif kind == "finish":
        s += f"{arg} completes at time {res['completion'][arg]}."
    elif kind == "start":
        s += f"{arg} first gets the CPU at time {res['start'][arg]}."
    elif kind == "order":
        s += f"Reading the chart from left to right gives {correct_text}."
    elif kind == "cpu":
        s += f"During that interval, {correct_text.replace('The CPU', 'the CPU')}."
    slides = ", ".join(f"5.{x}" for x in SLIDES[alg])
    return s + f" (Slides {slides}.)"


def difficulty(alg, qtype):
    kind = qtype.split(":")[0]
    if alg == "FCFS" and kind in ("order", "finish", "start", "cpu"):
        return "easy"
    if alg in ("SRTF", "PPRIO", "RR") and kind.startswith("avg"):
        return "hard"
    return "medium"


def build_numeric():
    out = []
    for i, (ds, alg, q, qtype, refs, opts) in enumerate(SPECS, 1):
        procs = D[ds]
        qid = f"c5-n{i:03d}"
        rng = random.Random(qid)
        res = simulate(procs, alg, q)
        alt = simulate(procs, alg, q, alt=True)
        correct = value(res, qtype)
        note = ""
        if value(alt, qtype) != correct:
            note = TIE_NOTE["RR" if alg == "RR" else "other"]
        kind = qtype.split(":")[0]
        if kind == "order":
            correct_text, wrong = correct, order_distractors(correct, procs, alg, rng)
        elif kind == "cpu":
            correct_text, wrong = cpu_options(correct, procs, rng)
        else:
            correct_text, wrong = fmt(correct), numeric_distractors(correct, res, procs, alg, qtype, rng)
        if opts.get("none"):
            options = ["None of the mentioned"] + wrong
        else:
            options = [correct_text] + wrong
        assert len(options) == 4 and len(set(options)) == 4, (qid, options)
        has_prio = len(procs[0]) == 4 and alg in ("PRIO", "PPRIO")
        headers = ["Process", "Arrival Time", "Burst Time"] + (["Priority"] if has_prio else [])
        rows = [[p[0], str(p[1]), str(p[2])] + ([str(p[3])] if has_prio else []) for p in procs]
        metric_hint = {"avg_wt": " Waiting time = turnaround time - burst time.",
                       "wt": " Waiting time = turnaround time - burst time.",
                       "avg_tat": " Turnaround time = completion time - arrival time.",
                       "tat": " Turnaround time = completion time - arrival time."}.get(kind, " Draw the Gantt chart first.")
        explanation = explain(res, procs, alg, q, qtype, correct_text)
        if opts.get("none"):
            explanation += f" The correct value, {correct_text}, is not among the listed numbers, so the answer is 'None of the mentioned'."
        out.append({
            "id": qid, "unit": 5, "topic": "Scheduling Algorithms (calculation)",
            "difficulty": difficulty(alg, qtype),
            "question": f"Consider the following processes (times in ms). Using {ALG_TEXT[alg].format(q=q)}, {question_text(qtype)}{note}",
            "table": {"headers": headers, "rows": rows},
            "options": options, "answer": 0,
            "hint": ALG_HINT[alg] + metric_hint,
            "explanation": explanation,
            "source": {"kind": "leak", "refs": refs} if refs else {"kind": "generated"},
            "syllabus_ref": {"file": "CH-5-Updated.pdf", "slides": SLIDES[alg]},
            "review_status": "approved",
        })
    return out


def main():
    concepts = json.load(open(os.path.join(SRC, "ch5_concepts.json")))
    mlfq = json.load(open(os.path.join(SRC, "ch5_mlfq.json")))
    bank = concepts + mlfq + build_numeric()
    json.dump(bank, open(OUT, "w"), ensure_ascii=False, indent=1)
    print(f"wrote {len(bank)} questions ({len(concepts)} concepts, {len(mlfq)} MLFQ, {len(bank) - len(concepts) - len(mlfq)} numeric)")


if __name__ == "__main__":
    main()
