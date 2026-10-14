/**
 * [INPUT]: 正文第三章、R04修正稿、作者修订的推荐优先展示与共享CaseMotion可见性时钟。
 * [OUTPUT]: window.WuwaSelection.mount(host)，提供推荐优先、品质取舍与向下沉积的三选一动画。
 * [POS]: dist第三章的独立观点演示；选择流程由本组件渲染，播放生命周期由motion.js管理。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function (global) {
  'use strict';

  // === 推荐优先是作者当前的展示修订；抽象候选不改写R04原始记录。 ===
  const RARITIES = {
    ordinary: { label:'普通', rank:1, color:'#76b8e3' },
    advanced: { label:'高级', rank:2, color:'#be94ec' },
    special: { label:'特级', rank:3, color:'#e4c183' },
    badge: { label:'徽记强化', rank:4, color:'#e4c183' }
  };
  const ROUNDS = [
    [{rarity:'badge'}, {rarity:'advanced'}, {rarity:'badge',recommended:true}],
    [{rarity:'badge',recommended:true}, {rarity:'ordinary'}, {rarity:'badge'}],
    [{rarity:'ordinary'}, {rarity:'advanced'}, {rarity:'special'}],
    [{rarity:'advanced'}, {rarity:'advanced'}, {rarity:'ordinary'}]
  ];
  const THUMB = '<path d="M-13 3L-5-5 0-19Q2-24 6-21Q10-19 9-13L7-4H22Q29-4 26 5L21 21Q20 25 14 25H-13Z"/><path d="M-24 3H-13V25H-24Z"/>';
  const SYMBOLS = [
    '<path d="M0-40 9-10 36 0 9 10 0 40-9 10-36 0-9-10Z"/><path d="m-25-25 50 50m0-50-50 50"/>',
    '<path d="M-20-35 12-35-3-7 23-7-20 39-8 8-27 8Z"/>',
    '<path d="M0-36C22-20 35-18 27 7 22 26 10 32 0 39-10 32-22 26-27 7-35-18-22-20 0-36Z"/><path d="M0-23V23m-14-7 14 9 14-9"/>',
    '<circle r="27"/><path d="M-12-37 8-27 26-37m11 25-10 20 10 18m-25 11-20-10-18 10m-11-25 10-20-10-18"/>'
  ];
  const instances = new WeakMap();
  let serial = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t*t*(3-2*t); };

  function selectionFor(round) {
    const recommendedOptions = round.map((card,index) => card.recommended ? index : -1).filter(index => index>=0);
    const candidates = recommendedOptions.length ? recommendedOptions : round.map((_,index) => index);
    const highest = Math.max(...candidates.map(index => RARITIES[round[index].rarity].rank));
    const best = candidates.filter(index => RARITIES[round[index].rarity].rank===highest);
    const selected = best[0];
    const winnerReason = recommendedOptions.length ? 'recommendation' : best.length>1 ? 'leftmost' : 'rarity';
    return { selected, winnerReason, recommended:Boolean(round[selected].recommended), recommendedOptions, tied:round.filter(card => RARITIES[card.rarity].rank===highest).length>1 };
  }

  function cardMarkup(index, prefix) {
    return `<g class="selection-card" transform="translate(${182 + index*233} 35)">
      <path class="selection-card-surface" d="M12 0H171L183 12V213L171 225H12L0 213V12Z"/>
      <path class="selection-card-edge" d="M12 0H171L183 12V213L171 225H12L0 213V12Z"/>
      <path class="selection-card-line" d="M18 16H57M126 16H165M18 207H57M126 207H165"/>
      <text class="selection-card-rarity" x="91.5" y="48" text-anchor="middle"></text>
      <g class="selection-card-symbol" transform="translate(91.5 106) scale(.9)"></g>
      <path class="selection-card-trace" d="M55 172H128"/>
      <g class="selection-card-recommendation" transform="translate(91.5 168)">
        <rect x="-65" y="-19" width="130" height="38" rx="19"/>
        <g class="selection-thumb" transform="translate(-40 -1) scale(.66)">${THUMB}</g>
        <text x="17" y="7" text-anchor="middle">推荐</text>
      </g>
      <g class="selection-card-check" transform="translate(91.5 208)">
        <circle r="14"/><path d="m-6 0 4 4 9-9"/>
      </g>
      <path class="selection-card-glow" filter="url(#${prefix}-glow)" d="M12 0H171L183 12V213L171 225H12L0 213V12Z"/>
    </g>`;
  }

  function rowMarkup(role, prefix) {
    return `<g class="selection-row" data-selection-row="${role}">
      <text class="selection-row-label" x="500" y="12" text-anchor="middle"></text>
      ${[0,1,2].map(index => cardMarkup(index,prefix)).join('')}
    </g>`;
  }

  function markup(prefix) {
    return `<figure class="selection-workbench" aria-label="先参考推荐，再按品质取舍的选择过程">
      <div class="selection-heading"><span class="selection-kicker">CHOICE → GROWTH</span><span class="selection-demo-label">轻阅读策略 · 优先参考推荐</span></div>
      <div class="selection-stage">
        <svg class="selection-scene" viewBox="100 0 800 500" aria-hidden="true" focusable="false">
          <defs><filter id="${prefix}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
            <linearGradient id="${prefix}-floor" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#090c0f" stop-opacity="0"/><stop offset="1" stop-color="#090c0f" stop-opacity=".88"/></linearGradient>
          </defs>
          <path class="selection-guide" d="M115 105H885M115 105V125M885 105V125M115 405V425H885V405"/>
          <path class="selection-axis" d="M500 86V114m-6-7 6 7 6-7"/>
          ${rowMarkup('previous',prefix)}${rowMarkup('current',prefix)}${rowMarkup('next',prefix)}
          <rect x="0" y="435" width="1000" height="65" fill="url(#${prefix}-floor)" pointer-events="none"/>
        </svg>
      </div>
      <figcaption class="selection-caption"><strong class="selection-status">优先参考推荐</strong><span class="selection-reason">没有推荐时比品质，同档取最左。</span></figcaption>
      <div class="selection-legend" aria-label="品质与推荐图例"><span class="selection-ordinary"><i></i>普通</span><span class="selection-advanced"><i></i>高级</span><span class="selection-special"><i></i>特级 / 徽记强化</span><span class="selection-recommended"><svg viewBox="-28 -25 60 55" aria-hidden="true" focusable="false">${THUMB}</svg>推荐</span><span class="selection-legend-rule">先推荐 → 再比品质 → 同档最左</span></div>
      <p class="selection-boundary">依据：R04研究与作者补充；候选重绘，仅呈现选择原则。</p>
      <div class="selection-build-support" aria-label="构筑成型的四层支持">
        <span><small>01 / 方向</small><b>开局徽记</b><em>先选构筑入口</em></span>
        <span><small>02 / 深化</small><b>配套核心</b><em>继续强化方向</em></span>
        <span><small>03 / 补充</small><b>通用隐喻</b><em>补资源与属性</em></span>
        <span><small>04 / 机会</small><b>商店购买</b><em>额外取得成长</em></span>
      </div>
    </figure>`;
  }

  function mount(host) {
    if (!host || typeof host.querySelector !== 'function') throw new TypeError('WuwaSelection需要DOM宿主');
    if (!global.CaseMotion?.mount) throw new Error('WuwaSelection依赖先加载CaseMotion');
    instances.get(host)?.destroy();
    const prefix = `selection-${++serial}`;
    host.classList.add('selection-root');
    host.innerHTML = markup(prefix);
    const rows = Object.fromEntries(['previous','current','next'].map(role => [role,host.querySelector(`[data-selection-row="${role}"]`)]));
    const status = host.querySelector('.selection-status');
    const reason = host.querySelector('.selection-reason');
    let snapshot = { progress:0, round:0, phase:0, selected:2, rarity:'badge', recommended:true, winnerReason:'recommendation', previousVisible:true };
    let destroyed = false;

    // === 稳定三组DOM：旧组留在下沿，新组从上方推进，无计时器和用户前置操作。 ===
    function paintRow(node, roundIndex, role, y, scale, opacity, chosen, glow) {
      const round = ROUNDS[(roundIndex+ROUNDS.length)%ROUNDS.length];
      const winner = selectionFor(round).selected;
      node.setAttribute('transform',`translate(${500*(1-scale)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})`);
      node.setAttribute('opacity',opacity.toFixed(3));
      node.querySelector('.selection-row-label').textContent = role==='previous' ? '' : role==='next' ? '下一组' : '本次选择';
      node.querySelector('.selection-row-label').setAttribute('y',role==='previous' ? '26' : '12');
      [...node.querySelectorAll('.selection-card')].forEach((card,index) => {
        const candidate = round[index];
        const rarity = RARITIES[candidate.rarity];
        const selected = chosen && index===winner;
        card.style.setProperty('--selection-card-color',rarity.color);
        card.setAttribute('data-rarity',candidate.rarity);
        card.setAttribute('data-recommended',String(Boolean(candidate.recommended)));
        card.setAttribute('data-selected',String(selected));
        card.setAttribute('transform',`translate(${182+index*233} ${35-(selected ? 8 : 0)})`);
        card.setAttribute('opacity',chosen && !selected ? '.38' : '1');
        card.querySelector('.selection-card-rarity').textContent = rarity.label;
        const symbol = card.querySelector('.selection-card-symbol');
        const symbolKey = candidate.rarity==='badge' ? 'badge' : `${roundIndex}-${index}`;
        if (symbol.dataset.symbol !== symbolKey) {
          symbol.innerHTML = SYMBOLS[candidate.rarity==='badge' ? 0 : (roundIndex+index+ROUNDS.length)%SYMBOLS.length];
          symbol.dataset.symbol = symbolKey;
        }
        card.querySelector('.selection-card-recommendation').style.opacity = candidate.recommended ? '1' : '0';
        card.querySelector('.selection-card-trace').style.opacity = candidate.recommended ? '0' : '.24';
        card.querySelector('.selection-card-edge').style.opacity = selected ? '1' : '.44';
        card.querySelector('.selection-card-check').style.opacity = selected ? '1' : '0';
        card.querySelector('.selection-card-glow').style.opacity = selected ? String(glow*.65) : '0';
      });
    }

    function render(progress) {
      if (destroyed) return;
      const p = clamp(Number(progress)||0);
      const position = (p*ROUNDS.length)%ROUNDS.length;
      const roundIndex = Math.floor(position);
      const local = position-roundIndex;
      const move = smooth((local-.72)/.28);
      const chosen = local>=.44;
      const phase = local<.15 ? 0 : local<.44 ? 1 : local<.72 ? 2 : 3;
      const round = ROUNDS[roundIndex];
      const decision = selectionFor(round);
      const { selected:winner, winnerReason, recommended, recommendedOptions, tied } = decision;
      paintRow(rows.previous,roundIndex-1,'previous',410+move*265,.925,(1-move)*.55,true,.3);
      paintRow(rows.current,roundIndex,'current',145+move*265,1-move*.075,1,true===chosen,.45+.55*Math.sin(clamp((local-.44)/.28)*Math.PI));
      paintRow(rows.next,roundIndex+1,'next',-270+move*415,1,move,false,0);
      const nextStatus = phase===3 ? '选择线索，降低连续取舍的阅读负担' : winnerReason==='recommendation' ? (chosen ? '看见推荐，优先选择' : '先看大拇指推荐') : winnerReason==='leftmost' ? (chosen ? '无推荐同档，取最左' : '没有推荐，再比较品质') : (chosen ? '无推荐，选最高品质' : '没有推荐，再比较品质');
      const nextReason = phase===3 ? '徽记确定方向，核心和通用隐喻逐步补足构筑。' : winnerReason==='recommendation' ? '两张同档金卡中，带大拇指的徽记强化先被选中。' : winnerReason==='leftmost' ? '最高档出现多个，用左侧位置作简单取舍。' : `${RARITIES[round[winner].rarity].label}是这一组的最高档。`;
      if (status.textContent!==nextStatus) status.textContent=nextStatus;
      if (reason.textContent!==nextReason) reason.textContent=nextReason;
      snapshot = { progress:p, round:roundIndex, phase, selected:winner, rarity:round[winner].rarity, recommended, recommendedOptions, winnerReason, tied, previousVisible:move<.45, local, moving:move>0 };
      host.dataset.selectionPhase=String(phase);
      host.dataset.selectionRound=String(roundIndex);
    }

    const motion = global.CaseMotion.mount(host,{ duration:20,render });
    const api = {
      getState() { return { ...snapshot,motion:motion.getState?.() }; },
      setProgress(progress) { motion.setProgress(progress); },
      destroy() {
        if (destroyed) return;
        destroyed=true;
        motion.destroy();
        host.innerHTML='';
        delete host.dataset.selectionPhase;
        delete host.dataset.selectionRound;
        instances.delete(host);
      }
    };
    instances.set(host,api);
    return api;
  }

  global.WuwaSelection = Object.freeze({ mount });
})(window);
