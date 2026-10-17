"""Collect the essay-style leak questions (short answer, diagram, matching, scheduling) into
data/bank/essay_archive.json for the future essay section. MCQ versions live in ch1-5.json."""
import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = []
for f in sorted(glob.glob(os.path.join(ROOT, "data", "leaks", "extracted", "L*.json"))):
    for q in json.load(open(f)):
        if q["type"] in ("short", "diagram", "match", "scheduling") and q["scope"] in ("in", "partial") \
                and q["answer_status"] not in ("fragment", "not_extracted") and q.get("answer"):
            out.append({"id": q["id"], "unit": q["chapter"], "type": q["type"], "question": q["question"],
                        "model_answer": q["answer"], "answer_status": q["answer_status"], "note": q["scope_note"]})
json.dump(out, open(os.path.join(ROOT, "data", "bank", "essay_archive.json"), "w"), ensure_ascii=False, indent=1)
print(len(out), "essay questions archived")
