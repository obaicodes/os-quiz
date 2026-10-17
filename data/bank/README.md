# بنك الأسئلة

ملف لكل وحدة (`ch1.json` … `ch5.json`)، وكل ملف مصفوفة أسئلة اختيار من متعدد.

## شكل السؤال

```json
{
  "id": "c2-001",
  "unit": 2,
  "topic": "System Calls",
  "difficulty": "easy | medium | hard",
  "question": "نص السؤال",
  "table": { "headers": ["Process", "Arrival", "Burst"], "rows": [["P1", "0", "5"]] },
  "code": "نص برمجي يُعرض بخط ثابت العرض",
  "options": ["A", "B", "C", "D"],
  "answer": 2,
  "hint": "تلميح لا يكشف الإجابة",
  "explanation": "شرح الإجابة الصحيحة مع ذكر الشريحة",
  "source": { "kind": "leak", "refs": ["L01-14", "L11-07"] },
  "syllabus_ref": { "file": "CH-2-Updated.pdf", "slides": [11] },
  "review_status": "pending"
}
```

- `table` و`code` اختياريان.
- `answer` هو رقم الخيار الصحيح في `options`، ويبدأ العد من 0. ترتيب الخيارات يُخلط عند العرض.
- `source.kind`: إما `leak` مع `refs` تشير إلى سجلات `data/leaks/extracted/`، أو `generated` للسؤال المكتوب من الصفر.
- `review_status`: إما `pending` أو `approved` أو `rejected`.

## القواعد (يفحصها `tools/validate_bank.py`)
- أربعة خيارات بالضبط، غير مكررة، وإجابة واحدة صحيحة.
- ممنوع "All of the above" و"B and C" وأي خيار يشير إلى حرف خيار آخر. أما "None of the mentioned" فمسموح.
- التلميح لا يحتوي نص الإجابة الصحيحة.
- كل شريحة في `syllabus_ref` يجب أن تكون ضمن المقرر، أي ليست في `data/syllabus/excluded_slides.json`.
- أسئلة Round Robin: عند التعادل، **تدخل العملية الواصلة حديثاً طابور الجاهزية قبل العملية التي انتهت حصتها**، وتُكتب القاعدة في نص السؤال إذا كانت تؤثر على الإجابة.
- الصياغة بمصطلحات شرائح المقرر، مثل "wait queue" بدلاً من "device queue".

## ترقيم الشرائح
- `syllabus_ref.slides` = **رقم الصفحة في ملف PDF** (نفس ترقيم `SYLLABUS_SCOPE.md`).
- الشرح (`explanation`) يذكر **الرقم المكتوب على الشريحة** مثل "Slide 1.32". في الوحدة 1 فقط يزيد هذا الرقم بواحد عن رقم الصفحة ابتداءً من الصفحة 19.

## طريقة التعديل وإعادة البناء
- **ch1 إلى ch4:** تُعدَّل مباشرة في الملف.
- **ch5:** يُبنى بالسكربت، فلا تُعدّل `ch5.json` يدوياً. التعديل يكون في أحد هذه الأماكن:
  - أسئلة المفاهيم: `src/ch5_concepts.json`
  - أسئلة الطوابير متعددة المستويات: `src/ch5_mlfq.json`
  - الأسئلة الحسابية: قائمة `SPECS` في `tools/build_ch5.py`، وإجاباتها تُحسب آلياً بـ `tools/sched.py`.
- بعد أي تعديل، شغّل الأوامر بهذا الترتيب:
  ```
  python3 tools/build_ch5.py        # إذا تغيّر شيء في الوحدة 5
  python3 tools/finalize_bank.py    # يخلط ترتيب الخيارات بشكل ثابت (seed = id)
  python3 tools/validate_bank.py    # يفحص كل القواعد
  ```
- `essay_archive.json`: الأسئلة المقالية الأصلية من التسريبات (32 سؤالاً) لقسم المقالي لاحقاً، ويُبنى بـ `tools/build_essay_archive.py`.
