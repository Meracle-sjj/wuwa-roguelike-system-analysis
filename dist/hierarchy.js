/**
 * [INPUT]: 依赖正文第二章、图3来源拓扑、图4基础节奏及theme.css共享色值，不依赖游戏或网络。
 * [OUTPUT]: 提供 window.WuwaHierarchy.mount(host)，呈现13个来源到12个徽记的分层映射与基础节奏。
 * [POS]: dist的构筑入口论证；DOM保留原图分组与单一坚盾节点，SVG只绘制具体机制间的连线。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function (global) {
  'use strict';

  // --- 来源是作者的分析回溯，颜色只表示基础主收益的解梦依赖。 ---
  const GROUPS = [
    { id:'action', title:'动作机制', note:'熟悉动作，新增收益', number:'01', row:1, end:6, mobile:1, mobileEnd:7 },
    { id:'resource', title:'生存资源', note:'防御与生命参与输出', number:'02', row:6, end:8, mobile:7, mobileEnd:10 },
    { id:'special', title:'角色特殊机制', note:'异常、破坏与结算', number:'03', row:8, end:12, mobile:10, mobileEnd:15 },
    { id:'mode', title:'模式专属设计', note:'新增能力组织方式', number:'04', row:12, end:14, mobile:15, mobileEnd:18 }
  ];
  const SOURCES = [
    ['attack','普攻命中','flame',1,2],
    ['echo','声骸技能','hurricane',2,3],
    ['liberation','共鸣解放','thunder',3,4],
    ['intro','变奏技能','ice',4,5],
    ['heavy','重击','shield',5,6],
    ['shield-resource','护盾','shield',6,8],
    ['life','生命资源','carnival',7,9],
    ['erosion','风蚀 / 光噪','peel',8,11],
    ['frost','霜渐','frost-end',9,12],
    ['fusion','聚爆','burn',10,13],
    ['disruption','震谐 / 谐度破坏','harmony',11,14],
    ['stack','叠层增益','flow',12,16],
    ['time','时间控制','time-control',13,17]
  ];
  const BADGES = [
    ['flame','热焰','gold',1,2], ['hurricane','飓风','gold',2,3],
    ['thunder','雷暴','gold',3,4], ['ice','冰绽','gold',4,5],
    ['shield','坚盾','jade',5,6,2,3], ['carnival','狂欢','jade',7,9],
    ['peel','剥蚀','jade',8,11], ['frost-end','霜灭','jade',9,12],
    ['burn','瞬燃','jade',10,13], ['harmony','谐度','jade',11,14],
    ['flow','心流','jade',12,16], ['time-control','时驭','jade',13,17]
  ];
  const instances = new WeakMap();
  let serial = 0;

  function rhythmIllustration(kind) {
    const gold = kind === 'gold';
    return `<div class="hierarchy-baseline hierarchy-baseline-${kind}">
      <div class="hierarchy-baseline-title"><i></i><h4>${gold ? '常态可用，入梦增强' : '主收益依赖解梦循环'}</h4></div>
      <svg viewBox="0 0 500 126" role="img" aria-label="${gold ? '常态有基础反馈，解梦内增强' : '准备期等待，解梦循环兑现主收益'}；两条曲线共用窗口与相同示意峰值">
        <rect class="hierarchy-dream-zone" x="205" y="14" width="118" height="75" rx="2"></rect>
        <path class="hierarchy-baseline-axis" d="M18 91H480"></path>
        <path class="hierarchy-baseline-line" d="${gold ? 'M18 71L54 67L85 72L116 68L148 72L181 67L205 70L224 59L246 25L264 20L284 25L305 58L323 70L355 67L385 72L416 68L449 72L480 67' : 'M18 87H205L224 59L246 25L264 20L284 25L305 58L323 87H480'}"></path>
        <text x="105" y="115" text-anchor="middle">常态准备</text><text x="264" y="115" text-anchor="middle">解梦阶段</text><text x="400" y="115" text-anchor="middle">退出 / 再准备</text>
      </svg>
      <p>${gold ? '日常操作已有反馈，再安排强化时机。' : '准备资源、开启状态，再兑现标志性收益。时驭的结算发生在退出后。'}</p>
    </div>`;
  }

  function boardMarkup(uid) {
    return `<div class="hierarchy-map" aria-label="十二徽记的设计来源，四个来源分组">
      <div class="hierarchy-column-head"><span>既有能力与新增规则</span><span>具体来源</span><span>构筑徽记</span></div>
      <div class="hierarchy-board">
        <svg class="hierarchy-wires" aria-hidden="true"><defs><marker id="${uid}-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z"></path></marker></defs><g class="hierarchy-paths"></g></svg>
        ${GROUPS.map(group => `<div class="hierarchy-frame hierarchy-frame-${group.id}" style="--row:${group.row};--end:${group.end};--mobile-row:${group.mobile};--mobile-end:${group.mobileEnd}" aria-hidden="true"></div>
          <div class="hierarchy-category hierarchy-category-${group.id}" style="--row:${group.row};--end:${group.end};--mobile-row:${group.mobile}"><span>${group.number}</span><h3>${group.title}</h3><p>${group.note}</p><small>${group.id === 'mode' ? '模式新增' : '角色既有能力'}</small></div>`).join('')}
        ${SOURCES.map(([id,label,target,row,mobile]) => `<div class="hierarchy-source" data-hierarchy-source="${id}" data-hierarchy-target="${target}" style="--row:${row};--mobile-row:${mobile}"><span>${label}</span></div>`).join('')}
        ${BADGES.map(([id,label,kind,row,mobile,span = 1,mobileSpan = 1]) => `<div class="hierarchy-badge hierarchy-badge-${kind} ${id === 'shield' ? 'hierarchy-badge-shared' : ''}" data-hierarchy-badge="${id}" data-hierarchy-kind="${kind}" style="--row:${row};--span:${span};--mobile-row:${mobile};--mobile-span:${mobileSpan}"><strong>${label}</strong>${id === 'shield' ? '<small>重击 × 护盾</small>' : ''}</div>`).join('')}
      </div>
      <div class="hierarchy-color-key"><span><i class="hierarchy-key-gold"></i>常态可用，入梦增强 <b>4</b></span><span><i class="hierarchy-key-jade"></i>主收益依赖解梦循环 <b>8</b></span></div>
      <p class="hierarchy-scope">按基础徽记主效果归类 · 隐喻可改写 · 作者分析分组，非官方设计分类</p>
    </div>`;
  }

  function mount(host) {
    if (!host || !host.ownerDocument) throw new TypeError('WuwaHierarchy.mount 需要一个 DOM 容器。');
    if (instances.has(host)) instances.get(host).destroy();
    const doc = host.ownerDocument;
    const view = doc.defaultView || global;
    const uid = 'hierarchy-' + (++serial);
    let disposed = false;
    let frame = null;
    let observer = null;
    host.classList.add('hierarchy-root');
    host.innerHTML = `<div class="hierarchy-thesis"><span>设计的起点</span><p>把角色已经会做的事，<strong>接成一条新的收益关系。</strong></p></div>
      ${boardMarkup(uid)}
      <div class="hierarchy-shield-explanation"><span>同一个坚盾，两个入口。</span><p><b>护盾积累荣耀</b><i aria-hidden="true">→</i><b>解梦中重击类伤害消耗荣耀、获得加深</b>。资源准备与收益兑现发生在不同阶段，不能把它归成单一动作。</p></div>
      <div class="hierarchy-dream-header"><div><span>公共条件</span><h3>解梦循环，组织基础反馈节奏。</h3></div><p>进入 <i>→</i> 期间 <i>→</i> 退出</p></div>
      <div class="hierarchy-baselines">${rhythmIllustration('gold')}${rhythmIllustration('jade')}</div>
      <p class="hierarchy-baseline-scope">共用解梦窗口与相同示意峰值，只比较收益时段，不比较数值强弱。颜色不代表整套构筑的开关，常态准备、辅助效果与隐喻条件分别判断。</p>
      <div class="hierarchy-arguments"><div><span>入口改变队伍循环</span><p>频繁大招、轮换声骸、积盾后重击、持续施加异常，需要的资源与频度各不相同。治疗角色也可能通过声骸参与构筑。</p></div><div><span>动作来源 ≠ 伤害类别</span><p>冰绽由变奏触发，追加输出归为共鸣技能伤害；狂欢的周期输出归为普攻伤害。坚盾·领域生成重击类伤害，也不代表角色执行了重击动作。</p></div><div><span>拥有动作 ≠ 顺畅重复</span><p>坚盾局中作者从绯雪改用千咲；飓风局因声骸冷却轮换三人。适配既要看能否触发，也要看动作条件、资源与使用频度。</p></div></div>`;

    // --- 节点由 CSS 负责排版；连线测量真实边界，避免宽屏/手机另造两套拓扑。 ---
    function draw() {
      frame = null;
      if (disposed) return;
      const board = host.querySelector('.hierarchy-board');
      const svg = host.querySelector('.hierarchy-wires');
      const rect = board.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      const paths = SOURCES.map(([id,,target]) => {
        const source = host.querySelector(`[data-hierarchy-source="${id}"]`).getBoundingClientRect();
        const badge = host.querySelector(`[data-hierarchy-badge="${target}"]`).getBoundingClientRect();
        const x1 = source.right - rect.left + 4;
        const y1 = source.top + source.height / 2 - rect.top;
        const x2 = badge.left - rect.left - 6;
        const y2 = badge.top + badge.height / 2 - rect.top;
        const bend = x1 + (x2 - x1) * .58;
        const shape = Math.abs(y2 - y1) < 1 ? `M${x1} ${y1}H${x2}` : `M${x1} ${y1}C${bend} ${y1} ${bend} ${y2} ${x2} ${y2}`;
        return `<path class="${target === 'shield' ? 'hierarchy-shared-wire' : ''}" data-hierarchy-edge="${id}:${target}" d="${shape}" marker-end="url(#${uid}-arrow)"></path>`;
      }).join('');
      host.querySelector('.hierarchy-paths').innerHTML = paths;
    }
    function schedule() {
      if (!disposed && frame === null) frame = view.requestAnimationFrame(draw);
    }
    view.addEventListener('resize', schedule);
    if (view.ResizeObserver) {
      observer = new view.ResizeObserver(schedule);
      observer.observe(host.querySelector('.hierarchy-board'));
    }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(schedule);
    draw();
    schedule();
    const api = {
      getState() { return { sources:SOURCES.length, badges:BADGES.length, gold:4, jade:8, groups:GROUPS.map(group => group.title), disposed }; },
      redraw:schedule,
      destroy() {
        if (disposed) return;
        disposed = true;
        view.removeEventListener('resize', schedule);
        if (observer) observer.disconnect();
        if (frame !== null) view.cancelAnimationFrame(frame);
        host.replaceChildren();
        host.classList.remove('hierarchy-root');
        instances.delete(host);
      }
    };
    instances.set(host, api);
    return api;
  }
  global.WuwaHierarchy = Object.freeze({ mount });
})(window);
