"""Shuffle the stored option order of every question deterministically (seeded by question id).

Idempotent: the correct option is moved to the front first, then shuffled with the same seed,
so running this twice gives the same file. Run after editing ch1-4 or rebuilding ch5.
"""
import json
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, "data", "bank")


def main():
    for unit in range(1, 6):
        path = os.path.join(BANK, f"ch{unit}.json")
        bank = json.load(open(path))
        for q in bank:
            opts = q["options"]
            correct = opts[q["answer"]]
            rest = [o for i, o in enumerate(opts) if i != q["answer"]]
            canonical = [correct] + sorted(rest)
            random.Random(q["id"]).shuffle(canonical)
            q["options"] = canonical
            q["answer"] = canonical.index(correct)
        json.dump(bank, open(path, "w"), ensure_ascii=False, indent=1)
        positions = [q["answer"] for q in bank]
        print(f"ch{unit}: answer positions A/B/C/D = {[positions.count(i) for i in range(4)]}")


if __name__ == "__main__":
    main()
