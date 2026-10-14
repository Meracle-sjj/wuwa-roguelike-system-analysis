/**
 * [INPUT]: 组件DOM可见性、页面visibility、低动态偏好与各组件的定性帧渲染函数。
 * [OUTPUT]: CaseMotion.mount及统一暂停接口；可见时自动循环，离开视野或隐藏时停帧。
 * [POS]: dist共用动画时钟；选择、节奏、反馈只描述画面，不分别建立计时器。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function (global) {
  'use strict';
  const instances = new Set();
  const hosts = new WeakMap();
  const reduced = !!global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let frame = null;
  let globallyPaused = false;
  let lastTime = null;
  const doc = global.document;

  // === 全页只有一个时钟；可见组件共享时间步长 ===
  function active(item) { return item.visible && !item.paused && !globallyPaused && !doc.hidden; }
  function updateState(item) {
    item.host.dataset.motionState = active(item) ? 'playing' : (item.visible ? 'paused' : 'offscreen');
  }
  function dispatchState() {
    doc.documentElement.dataset.motionPaused = String(globallyPaused);
    doc.dispatchEvent(new global.CustomEvent('case-motion-state', {detail:{paused:globallyPaused,reduced}}));
  }
  function schedule() {
    instances.forEach(updateState);
    const playing = [...instances].some(active);
    if (playing && frame === null) { lastTime = null; frame = global.requestAnimationFrame(tick); }
    if (!playing && frame !== null) { global.cancelAnimationFrame(frame); frame = null; lastTime = null; }
  }
  function draw(item, force = false) {
    const progress = Math.min(1,item.elapsed/item.duration);
    const sample = reduced ? Math.floor(item.elapsed) : Math.floor(item.elapsed*30);
    if (!force && item.sample === sample) return;
    item.sample = sample;
    item.host.dataset.motionProgress = progress.toFixed(3);
    item.host.dataset.motionCycle = String(item.cycle);
    item.render(progress,item.elapsed);
  }
  function tick(now) {
    frame = null;
    const delta = lastTime === null ? 0 : Math.min((now-lastTime)/1000,.1);
    lastTime = now;
    for (const item of instances) {
      if (!active(item)) continue;
      item.elapsed += delta;
      if (item.elapsed >= item.duration) { item.elapsed %= item.duration; item.cycle += 1; item.sample = -1; }
      draw(item);
    }
    if ([...instances].some(active)) frame = global.requestAnimationFrame(tick);
    else lastTime = null;
  }
  function visibleFallback(host) {
    const r = host.getBoundingClientRect();
    return r.height > 0 && r.bottom > 70 && r.top < global.innerHeight-40;
  }
  const observer = global.IntersectionObserver ? new global.IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = hosts.get(entry.target);
      if (item) item.visible = entry.isIntersecting && entry.intersectionRatio >= .12;
    }
    schedule();
  }, {threshold:[0,.12,.35,.65],rootMargin:'-55px 0px -25px 0px'}) : null;
  function checkFallback() {
    if (observer) return;
    instances.forEach(item => { item.visible = visibleFallback(item.host); });
    schedule();
  }
  doc.addEventListener('visibilitychange', schedule);
  global.addEventListener('scroll',checkFallback,{passive:true});
  global.addEventListener('resize',checkFallback,{passive:true});

  // === 每个舞台只提供duration与render，播放策略留在时钟层 ===
  function mount(host, options) {
    if (!host || typeof options?.render !== 'function') throw new TypeError('CaseMotion需要舞台与render函数。');
    hosts.get(host)?.api.destroy();
    const item = {host,duration:Math.max(1,Number(options.duration)||12),render:options.render,
      elapsed:0,cycle:0,sample:-1,visible:visibleFallback(host),paused:false,disposed:false};
    const api = {
      restart() { if (item.disposed) return;item.elapsed=0;item.cycle=0;draw(item,true);schedule(); },
      pause() { item.paused=true;schedule(); },
      play() { item.paused=false;schedule(); },
      setProgress(value) {
        if (item.disposed || !Number.isFinite(Number(value))) return;
        item.elapsed=Math.max(0,Math.min(1,Number(value)))*item.duration;draw(item,true);
      },
      getState:() => ({progress:item.elapsed/item.duration,elapsed:item.elapsed,cycle:item.cycle,
        playing:!item.disposed&&active(item),visible:item.visible,paused:item.paused||globallyPaused,reducedMotion:reduced}),
      destroy() {
        if (item.disposed) return;
        item.disposed=true;observer?.unobserve(host);instances.delete(item);hosts.delete(host);
        ['motionState','motionProgress','motionCycle'].forEach(key=>delete host.dataset[key]);schedule();
      }
    };
    item.api=api;instances.add(item);hosts.set(host,item);
    draw(item,true);observer?.observe(host);schedule();
    return api;
  }
  global.CaseMotion = Object.freeze({mount,
    setPaused(value) {globallyPaused=!!value;schedule();dispatchState();},
    getState:() => ({paused:globallyPaused,reducedMotion:reduced,instances:instances.size,playing:[...instances].filter(active).length})
  });
  dispatchState();
})(window);
