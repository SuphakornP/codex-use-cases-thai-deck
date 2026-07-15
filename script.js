(() => {
  "use strict";

  const useCases = Array.isArray(window.USE_CASES) ? window.USE_CASES : [];
  const supportedLanguages = new Set(["th", "en"]);
  const storageKey = "codex-field-guide-language";
  const categories = [
    { id: "everyday-work", th: "งานประจำ", en: "Everyday work" },
    { id: "data-decisions", th: "ข้อมูลและการตัดสินใจ", en: "Data and decisions" },
    { id: "finance-strategy", th: "การเงินและกลยุทธ์", en: "Finance and strategy" },
    { id: "sales-operations", th: "การขายและปฏิบัติการ", en: "Sales and operations" },
    { id: "education-career", th: "การศึกษาและอาชีพ", en: "Education and career" },
    { id: "design-build", th: "ออกแบบและสร้าง", en: "Design and build" },
    { id: "software-engineering", th: "วิศวกรรมซอฟต์แวร์", en: "Software engineering" },
    { id: "science-security", th: "วิทยาศาสตร์และความปลอดภัย", en: "Science and security" },
  ];

  const UI_COPY = {
    th: {
      locale: "th-TH",
      documentTitle: "Codex Field Guide — 99 Use Cases สำหรับคนทำงาน",
      documentDescription:
        "คู่มือ Codex สำหรับคนทำงาน: 99 use cases จากเอกสารทางการ พร้อม workflow ภาษาไทยและอังกฤษที่นำไปใช้ได้จริง",
      edition: "FIELD GUIDE / TH",
      skip: "ข้ามไปยังเนื้อหาสไลด์",
      home: "กลับไปสไลด์แรก",
      presentationTools: "เครื่องมือนำเสนอ",
      languageGroup: "เลือกภาษาของงานนำเสนอ",
      languageNames: { th: "ภาษาไทย", en: "ภาษาอังกฤษ" },
      toc: "สารบัญ",
      fullscreenEnter: "แสดงเต็มจอ",
      fullscreenExit: "ออกจากโหมดเต็มจอ",
      previous: "ก่อนหน้า",
      previousAria: "สไลด์ก่อนหน้า",
      next: "ถัดไป",
      nextAria: "สไลด์ถัดไป",
      hintStart: "กด → หรือ Space เพื่อเริ่ม",
      hintNavigate: "ใช้ปุ่มลูกศร, Space หรือปัดหน้าจอ",
      tocKicker: "NAVIGATE THE FIELD GUIDE",
      tocTitle: "เลือก use case ที่ใช่",
      tocClose: "ปิดสารบัญ",
      searchLabel: "ค้นหา use case",
      searchPlaceholder: "ค้นหา เช่น รายงาน, ข้อมูล, ประชุม…",
      categoryGroup: "กรองตามหมวด",
      allCategories: "ทั้งหมด",
      tocAction: "คลิกเพื่อไปยังสไลด์",
      emptySearch: "ไม่พบ use case ที่ตรงกับคำค้น ลองใช้คำที่กว้างขึ้นหรือเลือก “ทั้งหมด”",
      promptKicker: "PROMPT STARTER",
      promptTitle: "เริ่มคุยกับ Codex แบบนี้",
      promptClose: "ปิดตัวอย่าง prompt",
      promptHelp: "ปรับชื่อไฟล์ ช่วงเวลา และผลลัพธ์ให้ตรงกับงานของคุณ",
      copyPrompt: "คัดลอก Prompt",
      copied: "คัดลอกแล้ว",
      copySuccess: "คัดลอก Prompt แล้ว",
      copyFailed: "คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง",
      fullscreenFailed: "เบราว์เซอร์นี้ไม่อนุญาตโหมดเต็มจอ",
      source: "เปิด official source",
      promptButton: "ดู Prompt เริ่มต้น",
      humanCheckpoint: "Human checkpoint",
      workflowAria: "Workflow 4 ขั้น",
      chapters: {
        cover: "เปิดเรื่อง",
        framing: "หลักการทำงาน",
        map: "แผนที่ 8 หมวด",
        closing: "เริ่มลงมือ",
      },
      difficulty: { Easy: "เริ่มง่าย", Intermediate: "ปานกลาง", Advanced: "ขั้นสูง" },
      time: { "5m": "5 นาที", "30m": "30 นาที", "1h": "1 ชั่วโมง", "Long-running": "งานต่อเนื่อง" },
      dataErrorTitle: "ยังไม่พบข้อมูล use case",
      dataErrorBody: "รันคำสั่ง build data จากโฟลเดอร์นี้ แล้วเปิดหน้าใหม่อีกครั้ง",
      useCaseLabel: "Use case",
      imageAlt: "ภาพประกอบจากหน้า use case ของ OpenAI",
    },
    en: {
      locale: "en",
      documentTitle: "Codex Field Guide — 99 Use Cases for Knowledge Workers",
      documentDescription:
        "A practical Codex field guide with 99 official use cases, bilingual workflows, starter prompts, and human checkpoints.",
      edition: "FIELD GUIDE / EN",
      skip: "Skip to slide content",
      home: "Return to the first slide",
      presentationTools: "Presentation tools",
      languageGroup: "Choose presentation language",
      languageNames: { th: "Thai", en: "English" },
      toc: "Contents",
      fullscreenEnter: "Enter fullscreen",
      fullscreenExit: "Exit fullscreen",
      previous: "Previous",
      previousAria: "Previous slide",
      next: "Next",
      nextAria: "Next slide",
      hintStart: "Press → or Space to begin",
      hintNavigate: "Use arrow keys, Space, or swipe",
      tocKicker: "NAVIGATE THE FIELD GUIDE",
      tocTitle: "Choose the right use case",
      tocClose: "Close contents",
      searchLabel: "Search use cases",
      searchPlaceholder: "Search reports, data, meetings…",
      categoryGroup: "Filter by category",
      allCategories: "All",
      tocAction: "Select a use case to open its slide",
      emptySearch: "No use cases match this search. Try a broader term or choose “All”.",
      promptKicker: "PROMPT STARTER",
      promptTitle: "Start with this prompt",
      promptClose: "Close prompt example",
      promptHelp: "Replace file names, time ranges, and deliverables with details from your work.",
      copyPrompt: "Copy prompt",
      copied: "Copied",
      copySuccess: "Prompt copied",
      copyFailed: "Could not copy. Select the prompt and copy it manually.",
      fullscreenFailed: "This browser does not allow fullscreen mode.",
      source: "Open official source",
      promptButton: "View starter prompt",
      humanCheckpoint: "Human checkpoint",
      workflowAria: "Four-step workflow",
      chapters: {
        cover: "Introduction",
        framing: "Working principles",
        map: "Eight routes",
        closing: "Get started",
      },
      difficulty: { Easy: "Easy", Intermediate: "Intermediate", Advanced: "Advanced" },
      time: { "5m": "5 min", "30m": "30 min", "1h": "1 hour", "Long-running": "Long-running" },
      dataErrorTitle: "Use-case data is missing",
      dataErrorBody: "Run the data build command from this folder, then reload the page.",
      useCaseLabel: "Use case",
      imageAlt: "Illustration from the official OpenAI use-case page",
    },
  };

  const FIXED_COPY = {
    th: {
      cover: {
        aria: "สไลด์เปิดเรื่อง",
        imageAlt: "ภาพประกอบโต๊ะทำงานจาก OpenAI use case",
        kicker: "99 OFFICIAL USE CASES · BILINGUAL EDITION",
        title: "Codex",
        accent: "ฉบับคนทำงาน",
        subhead:
          "จาก “อยากให้งานเสร็จ” สู่ workflow ที่มอบหมาย ตรวจสอบ และนำไปใช้ได้จริง — โดยไม่ต้องเป็นคนเขียนโค้ด",
        authorLabel: "ผู้จัดทำ",
        author: "Suphakorn P.",
        footer: "สรุปจากเอกสารทางการ ณ 13 ก.ค. 2026 · เอกสารเพื่อการเรียนรู้ ไม่ใช่สื่อทางการของ OpenAI",
      },
      framing: {
        aria: "หลักการทำงานร่วมกับ Codex",
        kicker: "THE WORKING LOOP",
        title: "Codex ไม่ใช่ช่องถามตอบ",
        accent: "แต่คือพื้นที่ทำงานร่วมกัน",
        body: "เริ่มจากงานเล็กที่มีคำตอบให้ตรวจได้ แล้วค่อยเพิ่มสิทธิ์ แหล่งข้อมูล และความถี่เมื่อ workflow เชื่อถือได้",
        loopAria: "วงจรการทำงาน 4 ขั้น",
        steps: [
          ["01", "ให้บริบท", "บอกเป้าหมาย แหล่งข้อมูล ข้อจำกัด และสิ่งที่ห้ามเปลี่ยน"],
          ["02", "ให้ลงมือ", "ขอผลลัพธ์ที่ตรวจได้ เช่น เอกสาร ตาราง เว็บไซต์ หรือรายงาน"],
          ["03", "ให้ตรวจ", "เปิดไฟล์ ทดสอบตัวเลข เช็กแหล่งที่มา และแยกข้อเท็จจริงจากข้อสันนิษฐาน"],
          ["04", "ให้ปรับ", "บอก feedback ที่เฉพาะเจาะจง แล้วให้แก้จากชิ้นงานเดิม"],
        ],
      },
      map: {
        aria: "แผนที่ use case 8 หมวด",
        title: "เริ่มจาก",
        accent: "งานที่คุณมีอยู่แล้ว",
        body: "เลือกหมวดเพื่อเปิดสารบัญ หรือเลื่อนไปตามลำดับจากเอกสารทางการ ซึ่งรวมทั้ง Codex และ ChatGPT workflows",
        listAria: "หมวด use case",
      },
      closing: {
        aria: "สไลด์สรุป",
        title: "อย่าเริ่มจาก “Codex ทำอะไรได้?”",
        accent: "เริ่มจาก “งานไหนควรดีขึ้น?”",
        body: "เลือกหนึ่ง use case ทำรอบแรกแบบมีคนตรวจ แล้วเก็บ prompt และเกณฑ์คุณภาพไว้ใช้ซ้ำ",
        questionsAria: "คำถามก่อนเริ่ม",
        questions: [
          "งานไหนทำซ้ำบ่อยและกินเวลาคุณทุกสัปดาห์?",
          "ข้อมูลต้นทางอยู่ที่ไหน และ Codex อ่านได้แค่ไหน?",
          "อะไรคือหลักฐานที่ทำให้คุณกล้ากด ‘ใช้จริง’?",
        ],
      },
    },
    en: {
      cover: {
        aria: "Introduction slide",
        imageAlt: "Workspace illustration from an official OpenAI use case",
        kicker: "99 OFFICIAL USE CASES · BILINGUAL EDITION",
        title: "Codex",
        accent: "for knowledge work",
        subhead:
          "Move from “I need this done” to a workflow you can delegate, review, and reuse — no coding background required.",
        authorLabel: "Created by",
        author: "Suphakorn P.",
        footer:
          "Summarized from official documentation as of July 13, 2026 · For learning; not official OpenAI material",
      },
      framing: {
        aria: "Principles for working with Codex",
        kicker: "THE WORKING LOOP",
        title: "Codex is not a Q&A box",
        accent: "It is a shared workspace",
        body: "Start with a small task whose answer you can verify. Add permissions, sources, and frequency only after the workflow earns trust.",
        loopAria: "Four-step working loop",
        steps: [
          ["01", "Provide context", "State the goal, sources, constraints, and what must not change."],
          ["02", "Let it work", "Ask for something you can inspect: a document, table, website, or report."],
          ["03", "Verify", "Open files, test numbers, trace sources, and separate facts from inference."],
          ["04", "Refine", "Give specific feedback and continue from the existing artifact."],
        ],
      },
      map: {
        aria: "Map of eight use-case categories",
        title: "Start with",
        accent: "work you already do",
        body: "Choose a route to open the contents, or follow the official sequence across both Codex and ChatGPT workflows.",
        listAria: "Use-case categories",
      },
      closing: {
        aria: "Closing slide",
        title: "Do not start with “What can Codex do?”",
        accent: "Start with “Which job should improve?”",
        body: "Choose one use case, keep a person in the first review loop, then save the prompt and quality bar for reuse.",
        questionsAria: "Questions before you start",
        questions: [
          "Which repeated task takes time from you every week?",
          "Where does the source information live, and what can Codex access?",
          "What evidence would make you comfortable using the result?",
        ],
      },
    },
  };

  const slides = [
    { type: "cover", slug: "cover" },
    { type: "framing", slug: "how-to-work" },
    { type: "map", slug: "use-case-map" },
    ...useCases.map((item) => ({ type: "usecase", slug: item.slug, data: item })),
    { type: "closing", slug: "start-small" },
  ];

  const elements = {
    shell: document.querySelector("#deck-shell"),
    stage: document.querySelector("#deck-stage"),
    count: document.querySelector("#slide-count"),
    chapter: document.querySelector("#chapter-label"),
    progress: document.querySelector("#progress-fill"),
    previous: document.querySelector("#prev-button"),
    previousLabel: document.querySelector("#prev-label"),
    next: document.querySelector("#next-button"),
    nextLabel: document.querySelector("#next-label"),
    hint: document.querySelector("#control-hint"),
    home: document.querySelector("#home-button"),
    skip: document.querySelector("#skip-link"),
    edition: document.querySelector("#wordmark-edition"),
    topbarActions: document.querySelector("#topbar-actions"),
    fullscreen: document.querySelector("#fullscreen-button"),
    languageSwitch: document.querySelector("#language-switch"),
    languageButtons: Array.from(document.querySelectorAll("[data-language]")),
    toc: document.querySelector("#toc"),
    tocOpen: document.querySelector("#toc-button"),
    tocOpenLabel: document.querySelector("#toc-button-label"),
    tocClose: document.querySelector("#toc-close"),
    tocKicker: document.querySelector("#toc-kicker"),
    tocSearchLabel: document.querySelector("#toc-search-label"),
    tocSearch: document.querySelector("#toc-search"),
    tocList: document.querySelector("#toc-list"),
    tocCount: document.querySelector("#toc-result-count"),
    tocMetaAction: document.querySelector("#toc-meta-action"),
    categoryFilter: document.querySelector("#category-filter"),
    prompt: document.querySelector("#prompt-drawer"),
    promptKicker: document.querySelector("#prompt-kicker"),
    promptClose: document.querySelector("#prompt-close"),
    promptBackdrop: document.querySelector("#prompt-backdrop"),
    promptTitle: document.querySelector("#prompt-title"),
    promptHelp: document.querySelector("#prompt-help"),
    promptCopy: document.querySelector("#prompt-copy"),
    copyPrompt: document.querySelector("#copy-prompt"),
    copyPromptLabel: document.querySelector("#copy-prompt-label"),
    toast: document.querySelector("#toast"),
    printDeck: document.querySelector("#print-deck"),
    metaDescription: document.querySelector('meta[name="description"]'),
  };

  let currentLanguage = getInitialLanguage();
  let currentIndex = 0;
  let activeCategory = "all";
  let touchStart = null;
  let toastTimer = null;
  let focusBeforeOverlay = null;

  const escapeHTML = (value = "") =>
    String(value).replace(
      /[&<>'"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
    );

  const pad = (value) => String(value).padStart(2, "0");
  const copy = () => UI_COPY[currentLanguage];
  const fixedCopy = () => FIXED_COPY[currentLanguage];
  const otherLanguage = () => (currentLanguage === "th" ? "en" : "th");
  const localizedField = (item, field) => item[`${field}${currentLanguage === "th" ? "Th" : "En"}`];
  const secondaryField = (item, field) => item[`${field}${currentLanguage === "th" ? "En" : "Th"}`];

  function readStoredLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      console.warn("Could not read the saved presentation language.", error);
      return null;
    }
  }

  function writeStoredLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      console.warn("Could not save the presentation language.", error);
    }
  }

  function getInitialLanguage() {
    const url = new URL(window.location.href);
    const queryLanguage = url.searchParams.get("lang");
    if (url.searchParams.has("lang")) return supportedLanguages.has(queryLanguage) ? queryLanguage : "th";
    const storedLanguage = readStoredLanguage();
    return supportedLanguages.has(storedLanguage) ? storedLanguage : "th";
  }

  function syncLanguageUrl(language) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url.href);
  }

  function decodeHash() {
    try {
      return decodeURIComponent(window.location.hash.replace(/^#/, ""));
    } catch {
      return "";
    }
  }

  const arrowIcon = `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>`;

  const externalIcon = `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 4h6v6M20 4 11 13M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>`;

  const promptIcon = `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 5h16v11H8l-4 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>`;

  function formatMeta(item) {
    const currentCopy = copy();
    const difficulty = currentCopy.difficulty[item.difficulty] || item.difficulty;
    const time = currentCopy.time[item.time] || item.time;
    return [difficulty, time].filter(Boolean).join(" · ");
  }

  function renderCover() {
    const content = fixedCopy().cover;
    return `
      <article class="slide slide--cover cover" role="group" aria-label="${escapeHTML(content.aria)}">
        <div class="cover__image"><img src="assets/use-cases/daily-work-brief.webp" alt="${escapeHTML(content.imageAlt)}" /></div>
        <div class="cover__wash"></div>
        <div class="cover__content">
          <div class="cover__kicker reveal" style="--reveal-order: 0">
            <p class="eyebrow eyebrow--light">${escapeHTML(content.kicker)}</p>
          </div>
          <h1 class="reveal" style="--reveal-order: 1">${escapeHTML(content.title)}<span>${escapeHTML(content.accent)}</span></h1>
          <p class="cover__subhead reveal" style="--reveal-order: 2">${escapeHTML(content.subhead)}</p>
        </div>
        <p class="cover__author reveal" style="--reveal-order: 3">
          <span>${escapeHTML(content.authorLabel)}</span>
          <strong>${escapeHTML(content.author)}</strong>
        </p>
        <div class="cover__stamp reveal" style="--reveal-order: 4">SOURCE<br />OPENAI<br />USE CASES</div>
        <p class="cover__footer">${escapeHTML(content.footer)}</p>
      </article>`;
  }

  function renderFraming() {
    const content = fixedCopy().framing;
    return `
      <article class="slide slide--framing" role="group" aria-label="${escapeHTML(content.aria)}">
        <div class="framing-grid">
          <section class="framing-copy">
            <p class="eyebrow reveal" style="--reveal-order: 0">${escapeHTML(content.kicker)}</p>
            <h2 class="reveal" style="--reveal-order: 1">${escapeHTML(content.title)}<em>${escapeHTML(content.accent)}</em></h2>
            <p class="reveal" style="--reveal-order: 2">${escapeHTML(content.body)}</p>
          </section>
          <section class="work-loop" aria-label="${escapeHTML(content.loopAria)}">
            ${content.steps
              .map(
                ([number, title, detail], index) => `
                  <div class="loop-step reveal" style="--reveal-order: ${index + 1}">
                    <span class="loop-step__number">${number}</span>
                    <h3>${escapeHTML(title)}</h3>
                    <p>${escapeHTML(detail)}</p>
                  </div>`,
              )
              .join("")}
            <div class="loop-arrow reveal" style="--reveal-order: 5">${arrowIcon}</div>
          </section>
        </div>
      </article>`;
  }

  function renderMap() {
    const content = fixedCopy().map;
    const counts = Object.fromEntries(
      categories.map((category) => [category.id, useCases.filter((item) => item.categoryId === category.id).length]),
    );
    return `
      <article class="slide slide--map" role="group" aria-label="${escapeHTML(content.aria)}">
        <div class="map-layout">
          <section class="map-heading">
            <p class="eyebrow reveal" style="--reveal-order: 0">8 ROUTES · 99 USE CASES</p>
            <h2 class="reveal" style="--reveal-order: 1">${escapeHTML(content.title)}<em>${escapeHTML(content.accent)}</em></h2>
            <p class="reveal" style="--reveal-order: 2">${escapeHTML(content.body)}</p>
          </section>
          <section class="map-list" aria-label="${escapeHTML(content.listAria)}">
            ${categories
              .map(
                (category, index) => `
                  <button class="map-item reveal" style="--reveal-order: ${index + 1}" type="button" data-map-category="${category.id}">
                    <span class="map-item__number">${pad(index + 1)}</span>
                    <span class="map-item__title">${escapeHTML(category[currentLanguage])}</span>
                    <span class="map-item__count">${pad(counts[category.id])}</span>
                  </button>`,
              )
              .join("")}
          </section>
        </div>
      </article>`;
  }

  function renderUseCase(item) {
    const currentCopy = copy();
    const caseNumber = item.index + 1;
    const title = localizedField(item, "title");
    const secondaryTitle = secondaryField(item, "title");
    const workflow = localizedField(item, "workflow");
    const category = localizedField(item, "category");
    return `
      <article class="slide slide--usecase" role="group" aria-label="${currentCopy.useCaseLabel} ${caseNumber}: ${escapeHTML(title)}">
        <figure class="case-image">
          <img src="${escapeHTML(item.image)}" loading="lazy" alt="${escapeHTML(title)} — ${escapeHTML(currentCopy.imageAlt)}" />
          <figcaption class="case-image__label eyebrow eyebrow--light">USE CASE ${pad(caseNumber)}</figcaption>
          <span class="case-image__number" aria-hidden="true">${pad(caseNumber)}</span>
        </figure>
        <div class="case-main">
          <div class="case-meta reveal" style="--reveal-order: 0">
            <div class="case-meta__group">
              <span class="case-category">${escapeHTML(category)}</span>
              <span class="case-meta__dot" aria-hidden="true"></span>
              <span class="case-duration">${escapeHTML(formatMeta(item))}</span>
            </div>
            <a class="source-link" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer" aria-label="${escapeHTML(currentCopy.source)}: ${escapeHTML(title)}">
              <span>${escapeHTML(currentCopy.source)}</span>${externalIcon}
            </a>
          </div>

          <header class="case-heading">
            <h1 class="reveal" style="--reveal-order: 1">
              ${escapeHTML(title)}
              <span class="case-heading__secondary" lang="${otherLanguage()}">${escapeHTML(secondaryTitle)}</span>
            </h1>
            <button class="prompt-button reveal" style="--reveal-order: 2" type="button" data-prompt-index="${item.index}">
              ${promptIcon}<span>${escapeHTML(currentCopy.promptButton)}</span>
            </button>
          </header>

          <div class="case-body">
            <p class="case-summary reveal" style="--reveal-order: 2">${escapeHTML(localizedField(item, "summary"))}</p>
            <section class="workflow" aria-label="${escapeHTML(currentCopy.workflowAria)}">
              ${workflow
                .map(
                  (step, index) => `
                    <div class="workflow-step reveal" style="--reveal-order: ${index + 3}">
                      <div class="workflow-step__top">
                        <span class="workflow-step__number">${pad(index + 1)}</span>
                        <h2>${escapeHTML(step.label)}</h2>
                      </div>
                      <p>${escapeHTML(step.detail)}</p>
                    </div>`,
                )
                .join("")}
            </section>
          </div>

          <aside class="case-check reveal" style="--reveal-order: 7">
            <span class="case-check__icon" aria-hidden="true">✓</span>
            <p><strong>${escapeHTML(currentCopy.humanCheckpoint)}</strong> · ${escapeHTML(localizedField(item, "check"))}</p>
          </aside>
        </div>
      </article>`;
  }

  function renderClosing() {
    const content = fixedCopy().closing;
    return `
      <article class="slide slide--closing" role="group" aria-label="${escapeHTML(content.aria)}">
        <div class="closing-layout">
          <section class="closing-copy">
            <p class="eyebrow eyebrow--light reveal" style="--reveal-order: 0">YOUR FIRST WORKFLOW</p>
            <h2 class="reveal" style="--reveal-order: 1">${escapeHTML(content.title)}<em>${escapeHTML(content.accent)}</em></h2>
            <p class="reveal" style="--reveal-order: 2">${escapeHTML(content.body)}</p>
          </section>
          <section class="closing-questions" aria-label="${escapeHTML(content.questionsAria)}">
            ${content.questions
              .map(
                (question, index) => `
                  <div class="closing-question reveal" style="--reveal-order: ${index + 2}">
                    <span>0${index + 1}</span><p>${escapeHTML(question)}</p>
                  </div>`,
              )
              .join("")}
          </section>
        </div>
        <p class="closing-source">Source: learn.chatgpt.com/use-cases · 99 use cases reviewed</p>
      </article>`;
  }

  function renderSlide(slide) {
    if (slide.type === "cover") return renderCover();
    if (slide.type === "framing") return renderFraming();
    if (slide.type === "map") return renderMap();
    if (slide.type === "usecase") return renderUseCase(slide.data);
    return renderClosing();
  }

  function slideChapter(slide) {
    return slide.type === "usecase" ? localizedField(slide.data, "category") : copy().chapters[slide.type];
  }

  function slideTitle(slide) {
    return slide.type === "usecase" ? localizedField(slide.data, "title") : copy().documentTitle;
  }

  function updateFullscreenControl() {
    const label = document.fullscreenElement ? copy().fullscreenExit : copy().fullscreenEnter;
    elements.fullscreen.setAttribute("aria-label", label);
    elements.fullscreen.title = `${label} (F)`;
  }

  function renderChrome() {
    const currentCopy = copy();
    document.documentElement.lang = currentLanguage;
    if (elements.metaDescription) elements.metaDescription.content = currentCopy.documentDescription;
    elements.skip.textContent = currentCopy.skip;
    elements.home.setAttribute("aria-label", currentCopy.home);
    elements.edition.textContent = currentCopy.edition;
    elements.topbarActions.setAttribute("aria-label", currentCopy.presentationTools);
    elements.languageSwitch.setAttribute("aria-label", currentCopy.languageGroup);
    elements.languageSwitch.title = `${currentCopy.languageGroup} (L)`;
    elements.languageButtons.forEach((button) => {
      const language = button.dataset.language;
      button.setAttribute("aria-pressed", String(language === currentLanguage));
      button.setAttribute("aria-label", currentCopy.languageNames[language]);
    });
    elements.tocOpenLabel.textContent = currentCopy.toc;
    elements.tocOpen.setAttribute("aria-label", currentCopy.toc);
    elements.previousLabel.textContent = currentCopy.previous;
    elements.previous.setAttribute("aria-label", currentCopy.previousAria);
    elements.nextLabel.textContent = currentCopy.next;
    elements.next.setAttribute("aria-label", currentCopy.nextAria);
    elements.tocKicker.textContent = currentCopy.tocKicker;
    document.querySelector("#toc-title").textContent = currentCopy.tocTitle;
    elements.tocClose.setAttribute("aria-label", currentCopy.tocClose);
    elements.tocSearchLabel.textContent = currentCopy.searchLabel;
    elements.tocSearch.placeholder = currentCopy.searchPlaceholder;
    elements.categoryFilter.setAttribute("aria-label", currentCopy.categoryGroup);
    elements.tocMetaAction.textContent = currentCopy.tocAction;
    elements.promptKicker.textContent = currentCopy.promptKicker;
    elements.promptTitle.textContent = currentCopy.promptTitle;
    elements.promptClose.setAttribute("aria-label", currentCopy.promptClose);
    elements.promptHelp.textContent = currentCopy.promptHelp;
    elements.copyPromptLabel.textContent = currentCopy.copyPrompt;
    updateFullscreenControl();
  }

  function updateSlideChrome() {
    const slide = slides[currentIndex];
    elements.count.textContent = `${pad(currentIndex + 1)} / ${pad(slides.length)}`;
    elements.chapter.textContent = slideChapter(slide);
    elements.progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    elements.previous.disabled = currentIndex === 0;
    elements.next.disabled = currentIndex === slides.length - 1;
    elements.hint.textContent = currentIndex === 0 ? copy().hintStart : copy().hintNavigate;
    document.title = `${currentIndex + 1}/${slides.length} · ${slideTitle(slide)}`;
  }

  function bindStageActions() {
    elements.stage.querySelectorAll("[data-prompt-index]").forEach((button) => {
      button.addEventListener("click", () => openPrompt(Number(button.dataset.promptIndex)));
    });
    elements.stage.querySelectorAll("[data-map-category]").forEach((button) => {
      button.addEventListener("click", () => openToc(button.dataset.mapCategory));
    });
  }

  function renderCurrentSlide({ direction = 1, transition = "slide", preserveScroll = false } = {}) {
    const previousSlide = elements.stage.firstElementChild;
    const scrollTop = preserveScroll ? Math.max(previousSlide?.scrollTop ?? 0, elements.stage.scrollTop) : 0;
    const slide = slides[currentIndex];
    elements.stage.innerHTML = renderSlide(slide);
    const slideElement = elements.stage.firstElementChild;
    requestAnimationFrame(() => {
      if (!slideElement?.isConnected) return;
      if (transition === "language") slideElement.classList.add("is-language-changing");
      else slideElement.classList.add("is-entering", direction >= 0 ? "is-forward" : "is-backward");
    });
    updateSlideChrome();
    bindStageActions();
    if (preserveScroll) {
      requestAnimationFrame(() => {
        slideElement.scrollTop = scrollTop;
        elements.stage.scrollTop = scrollTop;
      });
    } else {
      slideElement.scrollTop = 0;
      elements.stage.scrollTop = 0;
    }
  }

  function setHash(slide) {
    const url = new URL(window.location.href);
    url.hash = encodeURIComponent(slide.slug);
    if (window.location.href !== url.href) history.replaceState(null, "", url.href);
  }

  function goTo(index, direction = 0, updateHash = true) {
    if (!slides.length) return;
    const previousIndex = currentIndex;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const resolvedDirection = direction || (nextIndex >= previousIndex ? 1 : -1);
    currentIndex = nextIndex;
    renderCurrentSlide({ direction: resolvedDirection });
    if (updateHash) setHash(slides[currentIndex]);
  }

  function setLanguage(language, { persist = true, updateUrl = true } = {}) {
    if (!supportedLanguages.has(language) || language === currentLanguage) return;
    currentLanguage = language;
    if (persist) writeStoredLanguage(language);
    if (updateUrl) syncLanguageUrl(language);
    renderChrome();
    renderCategoryFilter();
    renderTocList();
    if (useCases.length === 99) renderCurrentSlide({ transition: "language", preserveScroll: true });
    else showDataError();
    if (!elements.prompt.hidden && slides[currentIndex]?.type === "usecase") {
      elements.promptCopy.textContent = localizedField(slides[currentIndex].data, "prompt");
    }
  }

  function move(delta) {
    if (!elements.toc.hidden || !elements.prompt.hidden) return;
    goTo(currentIndex + delta, delta);
  }

  function renderCategoryFilter() {
    const categoryOptions = [{ id: "all", label: copy().allCategories }, ...categories.map((category) => ({
      id: category.id,
      label: category[currentLanguage],
    }))];
    elements.categoryFilter.innerHTML = categoryOptions
      .map(
        ({ id, label }) => `
          <button class="category-chip${id === activeCategory ? " is-active" : ""}" type="button" data-category="${id}" aria-pressed="${id === activeCategory}">
            ${escapeHTML(label)}
          </button>`,
      )
      .join("");
    elements.categoryFilter.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategoryFilter();
        renderTocList();
      });
    });
  }

  function getFilteredUseCases() {
    const query = elements.tocSearch.value.trim().toLocaleLowerCase(copy().locale);
    return useCases.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
      const workflowText = [...item.workflowTh, ...item.workflowEn]
        .flatMap((step) => [step.label, step.detail])
        .join(" ");
      const haystack = [
        item.titleTh,
        item.titleEn,
        item.summaryTh,
        item.summaryEn,
        item.categoryTh,
        item.categoryEn,
        workflowText,
      ]
        .join(" ")
        .toLocaleLowerCase(copy().locale);
      return matchesCategory && (!query || haystack.includes(query));
    });
  }

  function renderTocList() {
    const filtered = getFilteredUseCases();
    elements.tocCount.textContent = `${filtered.length} USE CASE${filtered.length === 1 ? "" : "S"}`;
    elements.tocList.innerHTML = filtered.length
      ? filtered
          .map((item) => {
            const title = localizedField(item, "title");
            const secondaryTitle = secondaryField(item, "title");
            return `
              <button class="toc-item" type="button" data-slide-index="${item.index + 3}">
                <span class="toc-item__number">${pad(item.index + 1)}</span>
                <span>
                  <span class="toc-item__title">${escapeHTML(title)}</span>
                  <span class="toc-item__secondary" lang="${otherLanguage()}">${escapeHTML(secondaryTitle)}</span>
                </span>
                <span class="toc-item__category">${escapeHTML(localizedField(item, "category"))}</span>
              </button>`;
          })
          .join("")
      : `<div class="empty-state"><p>${escapeHTML(copy().emptySearch)}</p></div>`;

    elements.tocList.querySelectorAll("[data-slide-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.slideIndex);
        closeToc(false);
        goTo(index, index >= currentIndex ? 1 : -1);
        elements.stage.focus({ preventScroll: true });
      });
    });
  }

  function openToc(category = "all") {
    focusBeforeOverlay = document.activeElement;
    activeCategory = category === "all" || categories.some((item) => item.id === category) ? category : "all";
    elements.tocSearch.value = "";
    renderCategoryFilter();
    renderTocList();
    elements.toc.hidden = false;
    elements.shell.inert = true;
    document.body.dataset.overlay = "toc";
    requestAnimationFrame(() => elements.tocSearch.focus());
  }

  function closeToc(restoreFocus = true) {
    elements.toc.hidden = true;
    elements.shell.inert = false;
    delete document.body.dataset.overlay;
    if (restoreFocus && focusBeforeOverlay instanceof HTMLElement) focusBeforeOverlay.focus();
  }

  function openPrompt(index) {
    const item = useCases.find((candidate) => candidate.index === index);
    if (!item) return;
    focusBeforeOverlay = document.activeElement;
    elements.promptCopy.textContent = localizedField(item, "prompt");
    elements.prompt.hidden = false;
    elements.shell.inert = true;
    document.body.dataset.overlay = "prompt";
    requestAnimationFrame(() => elements.promptClose.focus());
  }

  function closePrompt(restoreFocus = true) {
    elements.prompt.hidden = true;
    elements.shell.inert = false;
    delete document.body.dataset.overlay;
    if (restoreFocus && focusBeforeOverlay instanceof HTMLElement) focusBeforeOverlay.focus();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elements.toast.hidden = true;
    }, 1800);
  }

  async function copyPrompt() {
    const text = elements.promptCopy.textContent;
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      try {
        textarea.select();
        copied = document.execCommand("copy");
      } finally {
        textarea.remove();
      }
    }
    if (!copied) {
      showToast(copy().copyFailed);
      return;
    }
    showToast(copy().copySuccess);
    elements.copyPromptLabel.textContent = copy().copied;
    setTimeout(() => {
      elements.copyPromptLabel.textContent = copy().copyPrompt;
    }, 1800);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      showToast(copy().fullscreenFailed);
    }
  }

  function buildPrintDeck() {
    elements.printDeck.innerHTML = slides
      .map((slide) => `<section class="print-page">${renderSlide(slide)}</section>`)
      .join("");
  }

  function initializeFromHash() {
    const slug = decodeHash();
    const index = slides.findIndex((slide) => slide.slug === slug);
    currentIndex = index >= 0 ? index : 0;
    goTo(currentIndex, 1, index < 0);
  }

  function showDataError() {
    elements.stage.innerHTML = `
      <section class="slide empty-state">
        <div>
          <p class="eyebrow">DATA NOT BUILT</p>
          <h1>${escapeHTML(copy().dataErrorTitle)}</h1>
          <p>${escapeHTML(copy().dataErrorBody)} <code>python3 scripts/build_deck_data.py</code></p>
        </div>
      </section>`;
    elements.count.textContent = "00 / 00";
    elements.chapter.textContent = "";
    elements.previous.disabled = true;
    elements.next.disabled = true;
    document.title = copy().documentTitle;
  }

  function trapOverlayFocus(event) {
    if (event.key !== "Tab") return false;
    const overlay = !elements.prompt.hidden ? elements.prompt : !elements.toc.hidden ? elements.toc : null;
    if (!overlay) return false;
    const focusable = Array.from(
      overlay.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
    ).filter((node) => node.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      return true;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return true;
  }

  elements.previous.addEventListener("click", () => move(-1));
  elements.next.addEventListener("click", () => move(1));
  elements.home.addEventListener("click", () => goTo(0, -1));
  elements.fullscreen.addEventListener("click", toggleFullscreen);
  elements.languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  elements.tocOpen.addEventListener("click", () => openToc());
  elements.tocClose.addEventListener("click", () => closeToc());
  elements.tocSearch.addEventListener("input", renderTocList);
  elements.promptClose.addEventListener("click", () => closePrompt());
  elements.promptBackdrop.addEventListener("click", () => closePrompt());
  elements.copyPrompt.addEventListener("click", copyPrompt);

  document.addEventListener("fullscreenchange", updateFullscreenControl);

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    const interactive =
      target instanceof Element &&
      Boolean(target.closest("button, a, input, textarea, select, [role='button'], [contenteditable='true']"));
    if (trapOverlayFocus(event)) return;
    if (event.key === "Escape") {
      if (!elements.prompt.hidden) closePrompt();
      else if (!elements.toc.hidden) closeToc();
      return;
    }
    if (typing) return;
    if (interactive && (event.key === " " || event.key === "Enter")) return;
    if (!elements.toc.hidden || !elements.prompt.hidden) return;

    if (["ArrowRight", "PageDown"].includes(event.key) || event.key === " ") {
      event.preventDefault();
      move(1);
    } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0, -1);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1, 1);
    } else if (event.key.toLowerCase() === "o") {
      openToc();
    } else if (event.key.toLowerCase() === "f") {
      toggleFullscreen();
    } else if (event.key.toLowerCase() === "l") {
      setLanguage(otherLanguage());
    } else if (event.key.toLowerCase() === "p" && slides[currentIndex]?.type === "usecase") {
      openPrompt(slides[currentIndex].data.index);
    }
  });

  elements.stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    touchStart = { x: event.clientX, y: event.clientY };
  });

  elements.stage.addEventListener("pointerup", (event) => {
    if (!touchStart || event.pointerType === "mouse") return;
    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      move(deltaX < 0 ? 1 : -1);
    }
  });

  elements.stage.addEventListener("pointercancel", () => {
    touchStart = null;
  });

  window.addEventListener("hashchange", () => {
    const slug = decodeHash();
    const index = slides.findIndex((slide) => slide.slug === slug);
    if (index >= 0 && index !== currentIndex) goTo(index, index > currentIndex ? 1 : -1, false);
  });

  window.addEventListener("beforeprint", buildPrintDeck);
  window.addEventListener("afterprint", () => elements.printDeck.replaceChildren());

  renderChrome();
  syncLanguageUrl(currentLanguage);
  writeStoredLanguage(currentLanguage);
  if (useCases.length !== 99) {
    showDataError();
  } else {
    renderCategoryFilter();
    renderTocList();
    initializeFromHash();
  }
})();
