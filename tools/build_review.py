"""Build data/bank/review.html: a local, self-contained page for reviewing the question bank."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, "data", "bank")

questions = []
for unit in range(1, 6):
    questions += json.load(open(os.path.join(BANK, f"ch{unit}.json")))

PAGE = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Question Bank Review</title>
<style>
:root{--bg:#121417;--card:#1b1e23;--line:#2c3138;--text:#e6e8eb;--muted:#9aa3ad;--ok:#3fb67a;--accent:#5aa9e6;--warn:#e0b04a}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,sans-serif}
header{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;z-index:1}
select,input{background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:6px;padding:6px 8px;font:inherit}
input{flex:1;min-width:160px}#count{color:var(--muted)}
main{max-width:900px;margin:0 auto;padding:16px}
.q{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-bottom:14px}
.meta{display:flex;flex-wrap:wrap;gap:6px;font-size:12px;color:var(--muted);margin-bottom:8px}
.tag{border:1px solid var(--line);border-radius:999px;padding:1px 8px}.tag.gen{color:var(--warn);border-color:var(--warn)}
.stem{font-weight:600;margin-bottom:8px}
table{border-collapse:collapse;margin:6px 0 10px}td,th{border:1px solid var(--line);padding:3px 10px;text-align:center}
pre{background:#0d0f12;border:1px solid var(--line);border-radius:6px;padding:8px;overflow:auto;font:13px/1.4 ui-monospace,monospace}
ol{margin:6px 0 10px;padding-left:22px}li.correct{color:var(--ok);font-weight:600}
.small{font-size:13px;color:var(--muted)}.small b{color:var(--text)}
</style></head><body>
<header>
<select id="unit"><option value="">All units</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
<select id="kind"><option value="">All sources</option><option value="leak">Leak</option><option value="generated">Generated</option></select>
<select id="diff"><option value="">All difficulties</option><option>easy</option><option>medium</option><option>hard</option></select>
<input id="search" placeholder="Search text or id"><span id="count"></span>
</header><main id="list"></main>
<script>
const Q = __DATA__;
const esc = s => String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
function card(q){
  const t = q.table ? `<table><tr>${q.table.headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr>${q.table.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>` : "";
  const code = q.code ? `<pre>${esc(q.code)}</pre>` : "";
  const opts = q.options.map((o,i)=>`<li class="${i===q.answer?"correct":""}">${esc(o)}</li>`).join("");
  const src = q.source.kind==="leak" ? `leak: ${q.source.refs.join(", ")}` : "generated";
  return `<div class="q"><div class="meta"><span class="tag">${q.id}</span><span class="tag">Unit ${q.unit}</span><span class="tag">${esc(q.topic)}</span><span class="tag">${q.difficulty}</span><span class="tag ${q.source.kind==="generated"?"gen":""}">${src}</span><span class="tag">slides ${q.syllabus_ref.slides.join(", ")}</span></div>
  <div class="stem">${esc(q.question)}</div>${t}${code}<ol type="A">${opts}</ol>
  <div class="small"><b>Hint:</b> ${esc(q.hint)}</div><div class="small"><b>Explanation:</b> ${esc(q.explanation)}</div></div>`;
}
function render(){
  const u=unit.value,k=kind.value,d=diff.value,s=search.value.toLowerCase();
  const rows=Q.filter(q=>(!u||q.unit==u)&&(!k||q.source.kind===k)&&(!d||q.difficulty===d)&&(!s||(q.id+" "+q.question+" "+q.options.join(" ")).toLowerCase().includes(s)));
  count.textContent=`${rows.length} / ${Q.length}`;
  list.innerHTML=rows.map(card).join("");
}
for (const el of [unit,kind,diff]) el.onchange=render;
search.oninput=render; render();
</script></body></html>
"""

out = os.path.join(BANK, "review.html")
open(out, "w").write(PAGE.replace("__DATA__", json.dumps(questions, ensure_ascii=False).replace("</", "<\\/")))
print(f"wrote {out} with {len(questions)} questions")
