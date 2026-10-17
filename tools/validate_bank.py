"""Validate the question bank in data/bank/ against the rules in data/bank/README.md."""
import glob
import json
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, "data", "bank")
EXCLUDED = json.load(open(os.path.join(ROOT, "data", "syllabus", "excluded_slides.json")))
TOTAL_SLIDES = {int(k): v["total"] for k, v in EXCLUDED.items()}
EXCLUDED = {int(k): set(v["excluded"]) for k, v in EXCLUDED.items()}

LEAK_IDS = set()
for f in glob.glob(os.path.join(ROOT, "data", "leaks", "extracted", "L*.json")):
    LEAK_IDS.update(q["id"] for q in json.load(open(f)))

REQUIRED = ["id", "unit", "topic", "difficulty", "question", "options", "answer",
            "hint", "explanation", "source", "syllabus_ref", "review_status"]
BANNED = re.compile(r"all of (the )?(above|these|mentioned)|\b[a-d] (and|&) [a-d]\b|\bboth \(?[a-d]\)?\b", re.I)


def check(q, unit, errors):
    qid = q.get("id", "?")
    err = lambda msg: errors.append(f"{qid}: {msg}")
    for k in REQUIRED:
        if k not in q:
            err(f"missing field {k}")
    if errors and errors[-1].startswith(f"{qid}: missing"):
        return
    if q["unit"] != unit:
        err(f"unit {q['unit']} in ch{unit}.json")
    if q["difficulty"] not in ("easy", "medium", "hard"):
        err("bad difficulty")
    opts = q["options"]
    if len(opts) != 4:
        err(f"{len(opts)} options")
    if len({o.strip().lower() for o in opts}) != len(opts):
        err("duplicate options")
    if not isinstance(q["answer"], int) or not 0 <= q["answer"] < len(opts):
        err("answer index out of range")
        return
    for o in opts:
        if BANNED.search(o):
            err(f"banned option text: {o!r}")
    correct = opts[q["answer"]].strip().lower()
    if len(correct) > 3 and correct in q["hint"].lower():
        err("hint reveals the answer text")
    src = q["source"]
    if src.get("kind") not in ("leak", "generated"):
        err("bad source kind")
    for r in src.get("refs", []):
        if r not in LEAK_IDS:
            err(f"unknown leak ref {r}")
    if src.get("kind") == "leak" and not src.get("refs"):
        err("leak question without refs")
    ref = q["syllabus_ref"]
    if ref.get("file") != f"CH-{unit}-Updated.pdf":
        err(f"syllabus file {ref.get('file')}")
    for s in ref.get("slides", []):
        if s in EXCLUDED[unit] or not 1 <= s <= TOTAL_SLIDES[unit]:
            err(f"slide {s} is excluded or invalid")
    if not ref.get("slides"):
        err("no slides referenced")
    if q["review_status"] not in ("pending", "approved", "rejected"):
        err("bad review_status")
    if "table" in q:
        t = q["table"]
        if any(len(r) != len(t["headers"]) for r in t["rows"]):
            err("table row width mismatch")


def main():
    errors, ids, summary = [], Counter(), []
    for unit in range(1, 6):
        path = os.path.join(BANK, f"ch{unit}.json")
        if not os.path.exists(path):
            continue
        bank = json.load(open(path))
        for q in bank:
            ids[q.get("id")] += 1
            check(q, unit, errors)
        kinds = Counter(q["source"]["kind"] for q in bank)
        diff = Counter(q["difficulty"] for q in bank)
        summary.append(f"ch{unit}: {len(bank)} questions | leak {kinds['leak']} generated {kinds['generated']} "
                       f"| easy {diff['easy']} medium {diff['medium']} hard {diff['hard']}")
    errors += [f"{i}: duplicate id" for i, n in ids.items() if n > 1]
    print("\n".join(summary))
    if errors:
        print(f"\n{len(errors)} problem(s):")
        print("\n".join(errors))
        sys.exit(1)
    print("\nOK")


if __name__ == "__main__":
    main()
