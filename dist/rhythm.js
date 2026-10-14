/**
 * [INPUT]: 正文第四章、R03/R05、共享CaseMotion时钟与页面色值，不依赖游戏或网络。
 * [OUTPUT]: WuwaRhythm.mount(host)，案例切换后从准备开始自动循环的定性节奏对照。
 * [POS]: dist 的独立教学组件；共用进程比较隐喻前后，向 app.js 返回清理与控制接口。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function (global) {
  'use strict';

  // --- 案例只用于解释已记录的转向；曲线不是伤害或情绪模型。 ---
  const CASES = {
    wither: {
      label: '凋零的梦', route: '飓风 · R05',
      title: '从轮换触发，到积攒后集中释放',
      intro: '原本常态可触发的飓风，被凋零的梦改写为仅在解梦内触发；每次触发时额外触发 2 次。第五局由轮换三人的声骸，转向准备能量后在窗口内集中释放。',
      before: '选择前 · 常态可用，入梦增强',
      after: '选择后 · 凋零的梦，窗口集中',
      rule: '仅在解梦触发 · 每次额外触发 2 次',
      caption: '虚线保留选择前的参考节奏，金线表示改写后。窗口外的低线只表示徽记追加收益受到限制，角色攻击、声骸动作和其它效果没有被整体禁用。',
      source: '系统拆解案第四章 / R05 原段 13—14',
      sourceHref: 'sources/records/R05-修正稿.md',
      resource: '回能让下一次强化更早到来；延时为声骸释放留出空间。已有奇境梦蝶，是这次选择的配套条件。',
      trade: '日常触发机会换取窗口内的集中收益。是否值得，还要看声骸冷却、动作安排和其它持有项。',
      warning: '“额外 2 次”是规则文本，不等于最终 DPS 三倍；与其它核心的叠加没有在本案中实测。',
      phases: [
        ['准备', '选择前可继续用声骸触发飓风；选择后先为解梦准备能量，追加收益暂不兑现。'],
        ['解梦窗口', '两边都进入同一段示意窗口。选择后将声骸与追加触发集中在这里，延时与动作时机的价值更突出。'],
        ['退出 / 下一段准备', '基础飓风恢复常态触发；凋零的梦再次受解梦条件限制。低线不是角色停止战斗。']
      ]
    },
    gear: {
      label: '齿轮之心', route: '狂欢 · R03',
      title: '从有限窗口，到持续作战与持续风险',
      intro: '齿轮之心让解梦持续时间变为永久，代价是最终伤害降低 30%。第三局在取得后转向普攻增伤，但狂欢的持续失血也延长了生存压力。',
      before: '选择前 · 主收益依赖解梦循环',
      after: '选择后 · 齿轮之心，持续强化',
      rule: '入梦后永久 · 最终伤害 −30%',
      caption: '两边从同一位置开始入梦。选择后金色状态带延伸至示意末端；没有从开局直接获得永久解梦。循环回到起点是演示重播，不表示永久状态自动结束；曲线高低和面积不换算伤害。',
      source: '系统拆解案第四章 / R03 选择 12—16',
      sourceHref: 'sources/records/R03-修正稿.md',
      resource: '初次开启仍要准备能量。进入后，回能与延时在本次路线中的吸引力下降，本人转向普攻增伤。',
      trade: '持续强化也持续暴露狂欢失血压力。本人接受时长代价换增伤，是当局判断；动力锤与永久时长的具体交互未验证。',
      warning: '永久解梦 ≠ 永久免死。狂欢·忘返有自己的生效条件；R06 因回能充足拒绝齿轮，是另一个案例的独立理由。',
      phases: [
        ['首次准备', '齿轮仍需先进入解梦，不能把永久状态理解成开局自动开启。两边都先准备能量。'],
        ['已经入梦', '基础狂欢在有限窗口中兑现主收益；齿轮让这次解梦持续下去，同时保留最终伤害 −30% 的代价。'],
        ['基础退出 / 齿轮仍在解梦', '左侧窗口结束，右侧继续强化。狂欢失血压力延续；持续状态不会刷新或替代独立的致命伤保护规则。']
      ]
    }
  };
  const instances = new WeakMap();
  const START = 32;
  const END = 59;
  const PLOT = { left: 58, right: 674, top: 37, bottom: 208 };
  let serial = 0;

  function xAt(progress) { return PLOT.left + (PLOT.right - PLOT.left) * progress / 100; }
  function yAt(height) { return PLOT.bottom - (PLOT.bottom - PLOT.top) * height / 100; }
  function smoothstep(value) {
    const clamped = Math.max(0, Math.min(1, value));
    return clamped * clamped * (3 - 2 * clamped);
  }
  function windowEnvelope(t) {
    if (t < START || t >= END) return 0;
    return smoothstep((t - START) / 4) * smoothstep((END - t) / 4);
  }
  function gaussian(t, center, breadth) { return Math.exp(-Math.pow((t - center) / breadth, 2)); }
  function curve(caseId, changed, t) {
    if (caseId === 'wither') {
      const pulse = gaussian(t, 46, 6.5) * windowEnvelope(t);
      return changed ? 4 + 80 * pulse : 17 + 3 * Math.sin(t * 0.55) + 2 * Math.sin(t * 1.13) + 48 * pulse;
    }
    // --- 条件依赖收益在窗外精确回基线，渐变只占用已经入梦的示意区间。 ---
    const active = changed ? (t < START ? 0 : smoothstep((t - START) / 4)) : windowEnvelope(t);
    return 4 + active * (49 + 3.4 * Math.sin(t * 0.6) + 2 * Math.sin(t * 1.13));
  }
  function path(caseId, changed) {
    return Array.from({ length: 301 }, (_, i) => {
      const t = i / 3;
      return (i ? 'L' : 'M') + xAt(t).toFixed(2) + ',' + yAt(curve(caseId, changed, t)).toFixed(2);
    }).join(' ');
  }
  function chart(uid, side) {
    const changed = side === 'after';
    const clip = uid + '-' + side + '-clip';
    return `<article class="rhythm-chart-card">
      <div class="rhythm-chart-heading"><span class="rhythm-letter">${changed ? 'B' : 'A'}</span><h4 data-rhythm-title="${side}"></h4></div>
      <svg class="rhythm-plot" viewBox="0 0 710 278" role="img" aria-labelledby="${uid}-${side}-title ${uid}-${side}-desc">
        <title id="${uid}-${side}-title"></title><desc id="${uid}-${side}-desc"></desc>
        <defs><clipPath id="${clip}"><rect data-rhythm-clip="${side}" x="58" y="25" width="0" height="194"></rect></clipPath></defs>
        <g class="rhythm-grid"><path d="M58 65H674M58 113H674M58 161H674"></path></g>
        <rect data-rhythm-band="${side}" class="rhythm-band ${changed ? 'rhythm-band-gold' : ''}" x="${xAt(START)}" y="30" width="${xAt(END) - xAt(START)}" height="178"></rect>
        <path class="rhythm-axis" d="M58 31V208H680"></path>
        <text class="rhythm-axis-label" x="45" y="45" text-anchor="end">高</text><text class="rhythm-axis-label" x="45" y="210" text-anchor="end">低</text>
        <text class="rhythm-axis-label" x="17" y="124" text-anchor="middle" transform="rotate(-90 17 124)">预期体验 / 节奏示意</text>
        <path class="rhythm-boundary" d="M${xAt(START)} 30V211M${xAt(END)} 30V211"></path>
        <path data-rhythm-reference="${side}" class="rhythm-reference" ${changed ? '' : 'visibility="hidden"'}></path>
        <path data-rhythm-future="${side}" class="rhythm-future ${changed ? 'rhythm-gold' : ''}"></path>
        <path data-rhythm-curve="${side}" class="rhythm-curve ${changed ? 'rhythm-gold' : ''}" clip-path="url(#${clip})"></path>
        <line data-rhythm-marker="${side}" class="rhythm-marker" x1="58" x2="58" y1="27" y2="213"></line>
        <circle data-rhythm-dot="${side}" class="rhythm-dot ${changed ? 'rhythm-dot-gold' : ''}" cx="58" cy="208" r="4.5"></circle>
        <text class="rhythm-phase-label" x="145" y="235" text-anchor="middle">准备</text>
        <text class="rhythm-phase-label" x="${xAt((START + END) / 2)}" y="235" text-anchor="middle">入梦</text>
        <text data-rhythm-tail="${side}" class="rhythm-phase-label" x="557" y="235" text-anchor="middle">退出 / 再准备</text>
        <text class="rhythm-axis-label" x="365" y="264" text-anchor="middle">同一段示意战斗进程 →</text>
      </svg>
      <div class="rhythm-chart-legend"><span><i class="rhythm-key ${changed ? 'rhythm-key-gold' : 'rhythm-key-light'}"></i>${changed ? '隐喻改写后' : '基础主收益节奏'}</span>${changed ? '<span><i class="rhythm-key rhythm-key-dashed"></i>选择前参考</span>' : '<span><i class="rhythm-key rhythm-key-band"></i>解梦状态</span>'}</div>
    </article>`;
  }

  function mount(host) {
    if (!host || !host.ownerDocument) throw new TypeError('WuwaRhythm.mount 需要一个DOM容器。');
    if (instances.has(host)) instances.get(host).destroy();
    const doc = host.ownerDocument;
    const uid = 'rhythm-' + (++serial);
    let caseId = 'wither';
    let progress = 0;
    let motion = null;
    let previousPhase = -1;
    let disposed = false;
    const reduced = global.CaseMotion.getState().reducedMotion;
    host.classList.add('rhythm-root');
    host.innerHTML = `<div class="rhythm-workbench" aria-labelledby="${uid}-heading">
      <div class="rhythm-selector" role="group" aria-label="选择实际观察案例">
        <button type="button" class="rhythm-case is-active" data-rhythm-case="wither" aria-pressed="true"><span class="rhythm-case-index">01</span><span><b>凋零的梦</b><small>飓风 · R05 · 窗口集中</small></span><span class="rhythm-case-arrow" aria-hidden="true">↗</span></button>
        <button type="button" class="rhythm-case" data-rhythm-case="gear" aria-pressed="false"><span class="rhythm-case-index">02</span><span><b>齿轮之心</b><small>狂欢 · R03 · 持续覆盖</small></span><span class="rhythm-case-arrow" aria-hidden="true">↗</span></button>
      </div>
      <div class="rhythm-case-summary"><div class="rhythm-summary-title"><span class="rhythm-eyebrow">RULE → RHYTHM → CHOICE</span><h3 id="${uid}-heading" data-rhythm-heading></h3></div><p data-rhythm-intro></p><div class="rhythm-rule"><span aria-hidden="true">◇</span><strong data-rhythm-rule></strong><span class="rhythm-qualitative">定性示意 · 非实测</span></div></div>
      <div class="rhythm-charts">${chart(uid, 'before')}${chart(uid, 'after')}</div>
      <p class="rhythm-graph-caption" data-rhythm-caption></p>
      <div class="rhythm-console">
        <div class="rhythm-progress-track" aria-hidden="true"><i data-rhythm-playhead></i></div>
        <ol class="rhythm-phase-list" aria-label="解梦阶段"><li data-rhythm-phase-item="0">准备</li><li data-rhythm-phase-item="1">进入解梦</li><li data-rhythm-phase-item="2">基础窗口之后</li></ol>
        <div class="rhythm-stage-reading"><span class="rhythm-stage-tag" data-rhythm-stage aria-live="polite">准备</span><p id="${uid}-stage-description" data-rhythm-stage-description></p></div>
      </div>
      <div class="rhythm-implications"><article><span class="rhythm-card-kicker">RESOURCE</span><h4>下一次选择也变了</h4><p data-rhythm-resource></p></article><article><span class="rhythm-card-kicker">TRADE-OFF</span><h4>收益与代价一起看</h4><p data-rhythm-trade></p></article></div>
      <div class="rhythm-rule-boundary"><span class="rhythm-boundary-icon" aria-hidden="true">!</span><p data-rhythm-warning></p></div>
      <div class="rhythm-evidence"><span>案例来自已有游玩记录；选择前后曲线是规则解释，没有复现整套构筑。</span><a data-rhythm-source target="_blank" rel="noopener">查看记录 ↗</a></div>
    </div>`;

    const q = (selector) => host.querySelector(selector);
    const qa = (selector) => Array.from(host.querySelectorAll(selector));
    function phaseAt(p) { return p < START ? 0 : (p < END ? 1 : 2); }
    function text(selector, value) { q(selector).textContent = value; }
    function update() {
      const cfg = CASES[caseId];
      const phase = phaseAt(progress);
      const x = xAt(progress);
      q('[data-rhythm-playhead]').style.width = progress + '%';
      ['before', 'after'].forEach((side) => {
        q(`[data-rhythm-clip="${side}"]`).setAttribute('width', String(Math.max(0, x - PLOT.left)));
        const marker = q(`[data-rhythm-marker="${side}"]`);
        marker.setAttribute('x1', x); marker.setAttribute('x2', x);
        const dot = q(`[data-rhythm-dot="${side}"]`);
        dot.setAttribute('cx', x); dot.setAttribute('cy', yAt(curve(caseId, side === 'after', progress)));
      });
      qa('[data-rhythm-phase-item]').forEach((item, i) => {
        item.classList.toggle('is-current', i === phase);
        if (i === phase) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
      });
      if (phase !== previousPhase) {
        text('[data-rhythm-stage]', cfg.phases[phase][0]);
        text('[data-rhythm-stage-description]', cfg.phases[phase][1]);
        previousPhase = phase;
      }
      host.dataset.rhythmProgress = String(Math.round(progress));
      host.dataset.rhythmPhase = String(phase);
    }
    function setProgress(value) {
      if (disposed) return;
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return;
      progress = Math.max(0, Math.min(100, numeric));
      update();
    }
    function setCase(nextCase) {
      if (disposed || !CASES[nextCase]) return;
      caseId = nextCase;
      progress = 0;
      previousPhase = -1;
      const cfg = CASES[caseId];
      host.dataset.rhythmCase = caseId;
      qa('[data-rhythm-case]').forEach((button) => {
        const selected = button.dataset.rhythmCase === caseId;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      text('[data-rhythm-heading]', cfg.title); text('[data-rhythm-intro]', cfg.intro);
      text('[data-rhythm-rule]', cfg.rule); text('[data-rhythm-caption]', cfg.caption);
      text('[data-rhythm-resource]', cfg.resource); text('[data-rhythm-trade]', cfg.trade);
      text('[data-rhythm-warning]', cfg.warning);
      const source = q('[data-rhythm-source]'); source.textContent = cfg.source + ' ↗'; source.href = cfg.sourceHref;
      ['before', 'after'].forEach((side) => {
        const changed = side === 'after';
        const d = path(caseId, changed);
        text(`[data-rhythm-title="${side}"]`, cfg[side]);
        text('#' + uid + '-' + side + '-title', cfg[side] + '；定性节奏示意');
        text('#' + uid + '-' + side + '-desc', cfg.caption + ' 横轴为无实际时长的同一示意战斗进程，纵轴只有低、高。');
        q(`[data-rhythm-curve="${side}"]`).setAttribute('d', d);
        q(`[data-rhythm-future="${side}"]`).setAttribute('d', d);
        q(`[data-rhythm-reference="${side}"]`).setAttribute('d', path(caseId, false));
        q(`[data-rhythm-band="${side}"]`).setAttribute('width', String(xAt(changed && caseId === 'gear' ? 100 : END) - xAt(START)));
        text(`[data-rhythm-tail="${side}"]`, changed && caseId === 'gear' ? '持续解梦 →' : '退出 / 再准备');
      });
      update();
      motion?.restart();
    }
    function onClick(event) {
      const button = event.target.closest('button[data-rhythm-case]');
      if (button && host.contains(button)) setCase(button.dataset.rhythmCase);
    }
    host.addEventListener('click', onClick);
    setCase('wither');
    motion = global.CaseMotion.mount(q('.rhythm-charts'), {
      duration: 16,
      render(p) {
        // --- 起点与终点短停，读完窗口之后再自然回到准备。 ---
        setProgress(p < .07 ? 0 : p > .9 ? 100 : (p-.07)/.83*100);
        host.dataset.rhythmPlaying = String(motion?.getState().playing ?? false);
      }
    });
    const api = {
      setCase, setProgress,
      getState: () => ({ caseId, progress, phase: phaseAt(progress), playing: motion.getState().playing, cycle: motion.getState().cycle, reducedMotion: reduced }),
      destroy: () => {
        if (disposed) return;
        motion.destroy(); disposed = true;
        host.removeEventListener('click', onClick);
        host.innerHTML = ''; host.classList.remove('rhythm-root');
        ['rhythmProgress', 'rhythmPhase', 'rhythmCase', 'rhythmPlaying'].forEach((key) => delete host.dataset[key]);
        instances.delete(host);
      }
    };
    instances.set(host, api);
    return api;
  }
  global.WuwaRhythm = Object.freeze({ mount });
})(window);
