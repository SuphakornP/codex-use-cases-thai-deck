(() => {
  "use strict";

  const useCases = Array.isArray(window.USE_CASES) ? window.USE_CASES : [];
  const categories = [
    "งานประจำ",
    "ข้อมูลและการตัดสินใจ",
    "การเงินและกลยุทธ์",
    "การขายและปฏิบัติการ",
    "การศึกษาและอาชีพ",
    "ออกแบบและสร้าง",
    "วิศวกรรมซอฟต์แวร์",
    "วิทยาศาสตร์และความปลอดภัย",
  ];

  const slides = [
    { type: "cover", slug: "cover", chapter: "เปิดเรื่อง" },
    { type: "framing", slug: "how-to-work", chapter: "หลักการทำงาน" },
    { type: "map", slug: "use-case-map", chapter: "แผนที่ 8 หมวด" },
    ...useCases.map((item) => ({ type: "usecase", slug: item.slug, chapter: item.categoryTh, data: item })),
    { type: "closing", slug: "start-small", chapter: "เริ่มลงมือ" },
  ];

  const elements = {
    shell: document.querySelector("#deck-shell"),
    stage: document.querySelector("#deck-stage"),
    count: document.querySelector("#slide-count"),
    chapter: document.querySelector("#chapter-label"),
    progress: document.querySelector("#progress-fill"),
    previous: document.querySelector("#prev-button"),
    next: document.querySelector("#next-button"),
    hint: document.querySelector("#control-hint"),
    home: document.querySelector("#home-button"),
    fullscreen: document.querySelector("#fullscreen-button"),
    toc: document.querySelector("#toc"),
    tocOpen: document.querySelector("#toc-button"),
    tocClose: document.querySelector("#toc-close"),
    tocSearch: document.querySelector("#toc-search"),
    tocList: document.querySelector("#toc-list"),
    tocCount: document.querySelector("#toc-result-count"),
    categoryFilter: document.querySelector("#category-filter"),
    prompt: document.querySelector("#prompt-drawer"),
    promptClose: document.querySelector("#prompt-close"),
    promptBackdrop: document.querySelector("#prompt-backdrop"),
    promptCopy: document.querySelector("#prompt-copy"),
    copyPrompt: document.querySelector("#copy-prompt"),
    toast: document.querySelector("#toast"),
    printDeck: document.querySelector("#print-deck"),
  };

  let currentIndex = 0;
  let activeCategory = "ทั้งหมด";
  let touchStart = null;
  let toastTimer = null;
  let focusBeforeOverlay = null;

  const escapeHTML = (value = "") =>
    String(value).replace(
      /[&<>'"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
    );

  const pad = (value) => String(value).padStart(2, "0");

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
    const difficulty = {
      Easy: "เริ่มง่าย",
      Intermediate: "ปานกลาง",
      Advanced: "ขั้นสูง",
    }[item.difficulty] || item.difficulty;
    const time = {
      "5m": "5 นาที",
      "30m": "30 นาที",
      "1h": "1 ชั่วโมง",
      "Long-running": "งานต่อเนื่อง",
    }[item.time] || item.time;
    return [difficulty, time].filter(Boolean).join(" · ");
  }

  function renderCover() {
    return `
      <article class="slide slide--cover cover" role="group" aria-label="สไลด์เปิดเรื่อง">
        <div class="cover__image"><img src="assets/use-cases/daily-work-brief.webp" alt="ภาพประกอบโต๊ะทำงานจาก OpenAI use case" /></div>
        <div class="cover__wash"></div>
        <div class="cover__content">
          <div class="cover__kicker reveal" style="--reveal-order: 0">
            <p class="eyebrow eyebrow--light">99 OFFICIAL USE CASES · THAI EDITION</p>
          </div>
          <h1 class="reveal" style="--reveal-order: 1">Codex<br /><span>ฉบับคนทำงาน</span></h1>
          <p class="cover__subhead reveal" style="--reveal-order: 2">
            จาก “อยากให้งานเสร็จ” สู่ workflow ที่มอบหมาย ตรวจสอบ และนำไปใช้ได้จริง — โดยไม่ต้องเป็นคนเขียนโค้ด
          </p>
        </div>
        <div class="cover__stamp reveal" style="--reveal-order: 3">SOURCE<br />OPENAI<br />USE CASES</div>
        <p class="cover__footer">สรุปจากเอกสารทางการ ณ 13 ก.ค. 2026 · เอกสารเพื่อการเรียนรู้ ไม่ใช่สื่อทางการของ OpenAI</p>
      </article>`;
  }

  function renderFraming() {
    const steps = [
      ["01", "ให้บริบท", "บอกเป้าหมาย แหล่งข้อมูล ข้อจำกัด และสิ่งที่ห้ามเปลี่ยน"],
      ["02", "ให้ลงมือ", "ขอผลลัพธ์ที่ตรวจได้ เช่น เอกสาร ตาราง เว็บไซต์ หรือรายงาน"],
      ["03", "ให้ตรวจ", "เปิดไฟล์ ทดสอบตัวเลข เช็กแหล่งที่มา และแยกข้อเท็จจริงจากข้อสันนิษฐาน"],
      ["04", "ให้ปรับ", "บอก feedback ที่เฉพาะเจาะจง แล้วให้แก้จากชิ้นงานเดิม"],
    ];
    return `
      <article class="slide slide--framing" role="group" aria-label="หลักการทำงานร่วมกับ Codex">
        <div class="framing-grid">
          <section class="framing-copy">
            <p class="eyebrow reveal" style="--reveal-order: 0">THE WORKING LOOP</p>
            <h2 class="reveal" style="--reveal-order: 1">Codex ไม่ใช่ช่องถามตอบ<br /><em>แต่คือพื้นที่ทำงานร่วมกัน</em></h2>
            <p class="reveal" style="--reveal-order: 2">เริ่มจากงานเล็กที่มีคำตอบให้ตรวจได้ แล้วค่อยเพิ่มสิทธิ์ แหล่งข้อมูล และความถี่เมื่อ workflow เชื่อถือได้</p>
          </section>
          <section class="work-loop" aria-label="วงจรการทำงาน 4 ขั้น">
            ${steps
              .map(
                ([number, title, detail], index) => `
                  <div class="loop-step reveal" style="--reveal-order: ${index + 1}">
                    <span class="loop-step__number">${number}</span>
                    <h3>${title}</h3>
                    <p>${detail}</p>
                  </div>`,
              )
              .join("")}
            <div class="loop-arrow reveal" style="--reveal-order: 5">${arrowIcon}</div>
          </section>
        </div>
      </article>`;
  }

  function renderMap() {
    const counts = Object.fromEntries(categories.map((category) => [category, useCases.filter((item) => item.categoryTh === category).length]));
    return `
      <article class="slide slide--map" role="group" aria-label="แผนที่ use case 8 หมวด">
        <div class="map-layout">
          <section class="map-heading">
            <p class="eyebrow reveal" style="--reveal-order: 0">8 ROUTES · 99 USE CASES</p>
            <h2 class="reveal" style="--reveal-order: 1">เริ่มจาก<br /><em>งานที่คุณมีอยู่แล้ว</em></h2>
            <p class="reveal" style="--reveal-order: 2">เลือกหมวดเพื่อเปิดสารบัญ หรือเลื่อนไปตามลำดับจากเอกสารทางการ ซึ่งรวมทั้ง Codex และ ChatGPT workflows</p>
          </section>
          <section class="map-list" aria-label="หมวด use case">
            ${categories
              .map(
                (category, index) => `
                  <button class="map-item reveal" style="--reveal-order: ${index + 1}" type="button" data-map-category="${escapeHTML(category)}">
                    <span class="map-item__number">${pad(index + 1)}</span>
                    <span class="map-item__title">${escapeHTML(category)}</span>
                    <span class="map-item__count">${pad(counts[category])}</span>
                  </button>`,
              )
              .join("")}
          </section>
        </div>
      </article>`;
  }

  function renderUseCase(item) {
    const caseNumber = item.index + 1;
    return `
      <article class="slide slide--usecase" role="group" aria-label="Use case ${caseNumber}: ${escapeHTML(item.titleTh)}">
        <figure class="case-image">
          <img src="${escapeHTML(item.image)}" loading="lazy" alt="ภาพประกอบ ${escapeHTML(item.titleTh)} จากหน้า use case ของ OpenAI" />
          <figcaption class="case-image__label eyebrow eyebrow--light">USE CASE ${pad(caseNumber)}</figcaption>
          <span class="case-image__number" aria-hidden="true">${pad(caseNumber)}</span>
        </figure>
        <div class="case-main">
          <div class="case-meta reveal" style="--reveal-order: 0">
            <div class="case-meta__group">
              <span class="case-category">${escapeHTML(item.categoryTh)}</span>
              <span class="case-meta__dot" aria-hidden="true"></span>
              <span class="case-duration">${escapeHTML(formatMeta(item))}</span>
            </div>
            <a class="source-link" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer" aria-label="เปิด official source: ${escapeHTML(item.titleTh)}">
              <span>เปิด official source</span>${externalIcon}
            </a>
          </div>

          <header class="case-heading">
            <h1 class="reveal" style="--reveal-order: 1">
              ${escapeHTML(item.titleTh)}
              <span class="case-heading__en" lang="en">${escapeHTML(item.titleEn)}</span>
            </h1>
            <button class="prompt-button reveal" style="--reveal-order: 2" type="button" data-prompt-index="${item.index}">
              ${promptIcon}<span>ดู Prompt เริ่มต้น</span>
            </button>
          </header>

          <div class="case-body">
            <p class="case-summary reveal" style="--reveal-order: 2">${escapeHTML(item.summaryTh)}</p>
            <section class="workflow" aria-label="Workflow 4 ขั้น">
              ${item.workflow
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
            <p><strong>Human checkpoint</strong> · ${escapeHTML(item.checkTh)}</p>
          </aside>
        </div>
      </article>`;
  }

  function renderClosing() {
    const questions = [
      "งานไหนทำซ้ำบ่อยและกินเวลาคุณทุกสัปดาห์?",
      "ข้อมูลต้นทางอยู่ที่ไหน และ Codex อ่านได้แค่ไหน?",
      "อะไรคือหลักฐานที่ทำให้คุณกล้ากด ‘ใช้จริง’?",
    ];
    return `
      <article class="slide slide--closing" role="group" aria-label="สไลด์สรุป">
        <div class="closing-layout">
          <section class="closing-copy">
            <p class="eyebrow eyebrow--light reveal" style="--reveal-order: 0">YOUR FIRST WORKFLOW</p>
            <h2 class="reveal" style="--reveal-order: 1">อย่าเริ่มจาก “Codex ทำอะไรได้?”<br /><em>เริ่มจาก “งานไหนควรดีขึ้น?”</em></h2>
            <p class="reveal" style="--reveal-order: 2">เลือกหนึ่ง use case ทำรอบแรกแบบมีคนตรวจ แล้วเก็บ prompt และเกณฑ์คุณภาพไว้ใช้ซ้ำ</p>
          </section>
          <section class="closing-questions" aria-label="คำถามก่อนเริ่ม">
            ${questions
              .map(
                (question, index) => `
                  <div class="closing-question reveal" style="--reveal-order: ${index + 2}">
                    <span>0${index + 1}</span><p>${question}</p>
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

  function setHash(slide) {
    const nextHash = `#${encodeURIComponent(slide.slug)}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }

  function goTo(index, direction = 0, updateHash = true) {
    if (!slides.length) return;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const resolvedDirection = direction || (nextIndex >= currentIndex ? 1 : -1);
    currentIndex = nextIndex;
    const slide = slides[currentIndex];

    elements.stage.innerHTML = renderSlide(slide);
    const slideElement = elements.stage.firstElementChild;
    requestAnimationFrame(() => {
      slideElement.classList.add("is-entering", resolvedDirection >= 0 ? "is-forward" : "is-backward");
    });

    elements.count.textContent = `${pad(currentIndex + 1)} / ${pad(slides.length)}`;
    elements.chapter.textContent = slide.chapter;
    elements.progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    elements.previous.disabled = currentIndex === 0;
    elements.next.disabled = currentIndex === slides.length - 1;
    elements.hint.textContent = currentIndex === 0 ? "กด → หรือ Space เพื่อเริ่ม" : "ใช้ปุ่มลูกศร, Space หรือปัดหน้าจอ";
    document.title = `${currentIndex + 1}/${slides.length} · ${slide.type === "usecase" ? slide.data.titleTh : "Codex Field Guide"}`;
    if (updateHash) setHash(slide);
    elements.stage.scrollTop = 0;

    elements.stage.querySelectorAll("[data-prompt-index]").forEach((button) => {
      button.addEventListener("click", () => openPrompt(Number(button.dataset.promptIndex)));
    });
    elements.stage.querySelectorAll("[data-map-category]").forEach((button) => {
      button.addEventListener("click", () => openToc(button.dataset.mapCategory));
    });
  }

  function move(delta) {
    if (!elements.toc.hidden || !elements.prompt.hidden) return;
    goTo(currentIndex + delta, delta);
  }

  function renderCategoryFilter() {
    elements.categoryFilter.innerHTML = ["ทั้งหมด", ...categories]
      .map(
        (category) => `
          <button class="category-chip${category === activeCategory ? " is-active" : ""}" type="button" data-category="${escapeHTML(category)}" aria-pressed="${category === activeCategory}">
            ${escapeHTML(category)}
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
    const query = elements.tocSearch.value.trim().toLocaleLowerCase("th");
    return useCases.filter((item) => {
      const matchesCategory = activeCategory === "ทั้งหมด" || item.categoryTh === activeCategory;
      const haystack = `${item.titleTh} ${item.titleEn} ${item.summaryTh} ${item.categoryTh}`.toLocaleLowerCase("th");
      return matchesCategory && (!query || haystack.includes(query));
    });
  }

  function renderTocList() {
    const filtered = getFilteredUseCases();
    elements.tocCount.textContent = `${filtered.length} USE CASE${filtered.length === 1 ? "" : "S"}`;
    elements.tocList.innerHTML = filtered.length
      ? filtered
          .map(
            (item) => `
              <button class="toc-item" type="button" data-slide-index="${item.index + 3}">
                <span class="toc-item__number">${pad(item.index + 1)}</span>
                <span>
                  <span class="toc-item__title">${escapeHTML(item.titleTh)}</span>
                  <span class="toc-item__en" lang="en">${escapeHTML(item.titleEn)}</span>
                </span>
                <span class="toc-item__category">${escapeHTML(item.categoryTh)}</span>
              </button>`,
          )
          .join("")
      : `<div class="empty-state"><p>ไม่พบ use case ที่ตรงกับคำค้น ลองใช้คำที่กว้างขึ้นหรือเลือก “ทั้งหมด”</p></div>`;

    elements.tocList.querySelectorAll("[data-slide-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.slideIndex);
        closeToc(false);
        goTo(index, index >= currentIndex ? 1 : -1);
        elements.stage.focus({ preventScroll: true });
      });
    });
  }

  function openToc(category = "ทั้งหมด") {
    focusBeforeOverlay = document.activeElement;
    activeCategory = categories.includes(category) ? category : "ทั้งหมด";
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
    elements.promptCopy.textContent = item.promptTh;
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
      showToast("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง");
      return;
    }
    showToast("คัดลอก Prompt แล้ว");
    elements.copyPrompt.querySelector("span").textContent = "คัดลอกแล้ว";
    setTimeout(() => {
      elements.copyPrompt.querySelector("span").textContent = "คัดลอก Prompt";
    }, 1800);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showToast("เบราว์เซอร์นี้ไม่อนุญาตโหมดเต็มจอ");
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
          <h1>ยังไม่พบข้อมูล use case</h1>
          <p>รัน <code>python3 scripts/build_deck_data.py</code> จากโฟลเดอร์นี้ แล้วเปิดหน้าใหม่อีกครั้ง</p>
        </div>
      </section>`;
    elements.count.textContent = "00 / 00";
    elements.previous.disabled = true;
    elements.next.disabled = true;
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
  elements.tocOpen.addEventListener("click", () => openToc());
  elements.tocClose.addEventListener("click", () => closeToc());
  elements.tocSearch.addEventListener("input", renderTocList);
  elements.promptClose.addEventListener("click", () => closePrompt());
  elements.promptBackdrop.addEventListener("click", () => closePrompt());
  elements.copyPrompt.addEventListener("click", copyPrompt);

  document.addEventListener("fullscreenchange", () => {
    elements.fullscreen.setAttribute("aria-label", document.fullscreenElement ? "ออกจากโหมดเต็มจอ" : "แสดงเต็มจอ");
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    const interactive = target instanceof Element && Boolean(target.closest("button, a, input, textarea, select, [role='button'], [contenteditable='true']"));
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

  if (useCases.length !== 99) {
    showDataError();
  } else {
    renderCategoryFilter();
    renderTocList();
    initializeFromHash();
  }
})();
