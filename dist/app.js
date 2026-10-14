/**
 * [INPUT]: 原文、来源/选择/节奏/反馈/拳击组件、CaseMotion与index.html入口。
 * [OUTPUT]: 动作同栏对照与状态独立装配、统一暂停、完整原文阅读和资料对话框。
 * [POS]: dist页面编排器；阅读状态与各观点舞台分离，自动播放策略来自motion.js。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(() => {
  'use strict';
  const content = window.WuwaContent;
  if (!content) return;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);

  // === 原文阅读：章节完整，不把导览摘要写回原件 ===
  $('#original-intro').innerHTML = content.article.introHtml;
  $('#full-article').innerHTML = content.article.sections.map((section,index) => `<details class="reading-details" id="full-${section.id}"><summary><span>0${index+1}</span><strong>${esc(section.title)}</strong><span class="summary-action">展开 +</span></summary><div class="prose">${section.html}</div></details>`).join('');
  $('#original-method').innerHTML = content.methodHtml;
  $('#original-audit').innerHTML = content.auditHtml;
  $('#original-records').innerHTML = content.recordIndexHtml;
  const fullDetails = () => $$('#archive .reading-details');
  function syncExpandButton() {
    const allOpen = fullDetails().every(item => item.open);
    $('#toggle-all').textContent = allOpen ? '收起全部正文' : '展开全部正文';
    $('#toggle-all').setAttribute('aria-expanded', String(allOpen));
  }
  $('#toggle-all').addEventListener('click', () => {
    const open = !fullDetails().every(item => item.open);
    fullDetails().forEach(item => { item.open = open; });
    syncExpandButton();
  });
  fullDetails().forEach(item => item.addEventListener('toggle', syncExpandButton));
  function revealHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target?.matches('details')) { target.open = true; requestAnimationFrame(() => target.scrollIntoView({ block:'start' })); }
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();

  // === 图库和证据对话框：关闭后返回触发控件 ===
  let dialogTrigger;
  function openDialog(dialog, trigger) {
    dialogTrigger = trigger;
    dialog.showModal();
    dialog.querySelector('[data-close-dialog]').focus({ preventScroll:true });
  }
  $('#figure-gallery').innerHTML = content.figures.map((figure,index) => `<button class="gallery-item" data-open-figure="${figure.id}"><span class="thumb"><img src="${figure.file}" alt="${esc(figure.alt)}" loading="lazy" decoding="async"></span><p><span>0${index+1}</span><span>${esc(figure.title)}</span></p></button>`).join('');
  $('#record-list').innerHTML = content.records.map(record => `<button class="record-button" data-open-record="${record.id}"><span class="record-id">${record.id}</span><span><h4>${record.route}路线</h4><p>${esc(record.summary)}</p></span><span class="record-arrow" aria-hidden="true">↗</span></button>`).join('');
  const documents = {
    method:{ title:'来源与方法', html:content.methodHtml, path:content.sourceLinks.method },
    audit:{ title:'徽记触发核验', html:content.auditHtml, path:content.sourceLinks.audit },
    records:{ title:'六局游玩记录索引', html:content.recordIndexHtml, path:content.sourceLinks.records }
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-figure],[data-figure-id],[data-open-document],[data-open-record]');
    if (!trigger) return;
    const figureId = trigger.dataset.openFigure || trigger.dataset.figureId;
    if (figureId) {
      const figure = content.figures.find(item => item.id === figureId);
      if (!figure) return;
      $('#figure-dialog-title').textContent = figure.title;
      $('#figure-dialog-image').src = figure.file;
      $('#figure-dialog-image').alt = figure.alt;
      $('#figure-dialog-caption').textContent = `${figure.caption} ${figure.provenance}`;
      $('#figure-original-link').href = figure.file;
      openDialog($('#figure-dialog'), trigger);
      return;
    }
    const record = content.records.find(item => item.id === trigger.dataset.openRecord);
    const source = record ? { title:`${record.id} · ${record.route}路线修正稿`, path:record.sourcepath, html:`<p class="boundary-note">${esc(record.boundary)} ASR分段用于定位，录音时长不等于净战斗时间。</p><p><a href="${record.asrpath}">查看原始 ASR</a></p>${record.html}` } : documents[trigger.dataset.openDocument];
    if (!source) return;
    $('#document-dialog-title').textContent = source.title;
    $('#document-dialog-body').innerHTML = `<a class="source-document-link" href="${source.path}">打开本地 Markdown 原件 ↗</a>${source.html}`;
    openDialog($('#document-dialog'), trigger);
  });
  $$('dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { dialogTrigger?.focus?.({ preventScroll:true }); });
  });

  // === 自动演示统一暂停；正常阅读不需要按启动按钮 ===
  const motionToggle = $('#motion-toggle');
  function syncMotion() {
    const paused = window.CaseMotion.getState().paused;
    motionToggle.textContent = paused ? '继续动画 ▷' : '暂停动画 Ⅱ';
    motionToggle.setAttribute('aria-pressed',String(paused));
  }
  motionToggle.addEventListener('click',()=>window.CaseMotion.setPaused(!window.CaseMotion.getState().paused));
  document.addEventListener('case-motion-state',syncMotion);
  syncMotion();

  // === 章节定位与组件装配 ===
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if (!current) return;
      $$('.chapter-nav a').forEach(link => { const active = link.hash === `#${current.target.id}`; link.classList.toggle('active',active); if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    }, { rootMargin:'-12% 0px -65% 0px', threshold:0 });
    $$('section.chapter:not(.archive-section)').forEach(section => observer.observe(section));
  }
  window.WuwaPage = {
    hierarchy:window.WuwaHierarchy.mount($('#hierarchy-root')),
    selection:window.WuwaSelection.mount($('#selection-root')),
    rhythm:window.WuwaRhythm.mount($('#rhythm-root')),
    feedback:window.WuwaFeedbackScenes.mount({ actionHost:$('#iaido-scene-root'), stateHost:$('#state-scene-root') }),
    boxing:window.WuwaBoxingScene.mount($('#boxing-scene-root'))
  };
})();
