# Codex Field Guide — 99 Use Cases สำหรับคนทำงาน

Web presentation ภาษาไทยที่สรุป use case ทั้งหมด 99 รายการจาก [OpenAI Learn: Use cases](https://learn.chatgpt.com/use-cases) ณ วันที่ 13 กรกฎาคม 2026 แต่ละ use case มีสไลด์เฉพาะ พร้อม workflow 4 ขั้น, Prompt เริ่มต้น, Human checkpoint และลิงก์กลับไปยัง official source

> หน้า official รวมทั้ง ChatGPT และ Codex workflows งานนี้จึงคงชื่อเครื่องมือในแต่ละ use case ให้ตรงกับต้นฉบับ แม้ชื่อ presentation จะเน้น Codex

## เปิด Presentation

เปิด `index.html` ได้โดยตรง หรือใช้ local server เพื่อให้ browser ทำงานครบที่สุด:

```bash
cd codex-use-cases-thai-deck
python3 -m http.server 4173
```

จากนั้นเปิด `http://localhost:4173`

## การควบคุม

- `←` / `→`, `Page Up` / `Page Down`, `Space` — เปลี่ยนสไลด์
- `O` — เปิดสารบัญ ค้นหา และกรอง 8 หมวด
- `P` — เปิด Prompt ของ use case ปัจจุบัน
- `F` — เข้า/ออกโหมดเต็มจอ
- `Home` / `End` — ไปสไลด์แรก/สุดท้าย
- `Esc` — ปิดสารบัญหรือ Prompt
- มือถือ/แท็บเล็ต — ปัดซ้ายขวาเพื่อเปลี่ยนสไลด์ และเลื่อนขึ้นลงเพื่ออ่าน workflow

แต่ละ URL มี hash ของ use case เช่น `#daily-work-brief` จึงส่งลิงก์ตรงไปยังสไลด์ที่ต้องการได้

## เนื้อหาในโฟลเดอร์

- `index.html`, `styles.css`, `script.js` — presentation แบบ static ไม่มี runtime dependency
- `data/usecases-data.js` — ข้อมูล 99 สไลด์ที่ build แล้ว
- `data/usecases-th-01.json` ถึง `data/usecases-th-03.json` — เนื้อหาไทยที่เรียบเรียงสำหรับสไลด์
- `data/source-usecases.json` — inventory จาก official pages พร้อม source URL
- `assets/use-cases/` — ภาพประกอบจากหน้า official use cases จำนวน 99 ภาพ
- `assets/fonts/` — IBM Plex Sans Thai และ Chakra Petch สำหรับใช้งานแบบ offline
- `scripts/` — เครื่องมือ refresh source และรวมข้อมูล

## Refresh ข้อมูล (ไม่จำเป็นสำหรับการนำเสนอ)

ไฟล์ที่พร้อมใช้อยู่แล้วไม่ต้องติดตั้งอะไรเพิ่ม หากต้องการดึงหน้า official ใหม่ ต้องมี Python packages `beautifulsoup4` และ `requests`:

```bash
python3 scripts/scrape_official_use_cases.py
python3 scripts/build_deck_data.py
```

ตัว scraper ตั้งใจตรวจว่าหน้า official ยังมี 99 use cases หากจำนวนเปลี่ยนจะหยุดและแจ้งให้ทบทวนเนื้อหาไทยก่อน build ใหม่

## Source และการใช้งานภาพ

เนื้อหาเป็นบทสรุปภาษาไทยเพื่อการเรียนรู้ ไม่ใช่สื่อทางการของ OpenAI ทุกสไลด์มีลิงก์ไปยังหน้าต้นฉบับ ภาพประกอบถูกเก็บจากหน้า official use cases เพื่อใช้ใน presentation นี้ ควรตรวจเงื่อนไขการใช้งานของ OpenAI ก่อนเผยแพร่ต่อสาธารณะหรือใช้เชิงพาณิชย์

## License

โค้ดต้นฉบับของโปรเจกต์เผยแพร่ภายใต้ [MIT License](LICENSE) ส่วนภาพ เนื้อหาที่อ้างอิงแหล่งข้อมูลภายนอก และฟอนต์ไม่อยู่ภายใต้ MIT License โปรดดู [Third-party notices](THIRD_PARTY_NOTICES.md) และ [SIL Open Font License 1.1](assets/fonts/OFL-1.1.txt) สำหรับรายละเอียด
