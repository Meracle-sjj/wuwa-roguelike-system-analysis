/*
 * [INPUT]: CaseMotion 的可见性时钟、第五章动作确认与状态可见的提案边界。
 * [OUTPUT]: WuwaFeedbackScenes.mount，向独立动作/状态宿主提供两个原生 SVG 姿态动画。
 * [POS]: dist 的反馈表现模块；动作与拳击并列由入口编排，只消费共享时钟，不推断游戏规则。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function () {
  'use strict';
  const SVG = 'http://www.w3.org/2000/svg';
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const mix = (a, b, weight) => a + (b - a) * weight;
  const smooth = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const ramp = (time, start, end) => smooth((time - start) / (end - start));
  let serial = 0;

  function node(name, attrs = {}, parent) {
    const element = document.createElementNS(SVG, name);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (parent) parent.appendChild(element);
    return element;
  }
  function attr(element, values) {
    Object.entries(values).forEach(([key, value]) => element.setAttribute(key, value));
  }
  function interpolate(frames, time) {
    let index = frames.findIndex((frame) => frame.time >= time);
    if (index < 0) index = frames.length - 1;
    if (index === 0) return { ...frames[0].pose };
    const before = frames[index - 1], after = frames[index];
    const weight = smooth((time - before.time) / (after.time - before.time));
    const output = {};
    Object.keys(before.pose).forEach((key) => {
      output[key] = Array.isArray(before.pose[key])
        ? before.pose[key].map((value, i) => mix(value, after.pose[key][i], weight))
        : mix(before.pose[key], after.pose[key], weight);
    });
    return output;
  }
  function frame(time, base, changes = {}) {
    return { time, pose: { ...base, ...changes } };
  }
  function path(points) {
    return points.map((point, index) => `${index ? 'L' : 'M'}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(' ');
  }

  // ---------- 舞台与人体：关键帧保存关节，绘制只负责几何 ----------
  function stage(host, kind, title, subtitle, steps, description) {
    const section = document.createElement('section');
    section.className = `feedback-scene feedback-scene-${kind}`;
    section.innerHTML = `<header class="feedback-scene-heading"><span>${kind === 'action' ? '关键动作 · 居合斩' : '作用对象 · 增益与减益'}</span><h4>${title}</h4><p>${subtitle}</p></header><div class="feedback-scene-screen"></div><div class="feedback-scene-caption"><span class="feedback-scene-phase"></span><p></p></div><ol class="feedback-scene-steps">${steps.map((step) => `<li>${step}</li>`).join('')}</ol><p class="feedback-scene-boundary">${description}</p>`;
    host.appendChild(section);
    const screen = section.querySelector('.feedback-scene-screen');
    const id = `feedback-${kind}-${++serial}`;
    const svg = node('svg', { viewBox: '0 0 720 390', role: 'img', 'aria-labelledby': `${id}-title ${id}-desc`, focusable: 'false' }, screen);
    const svgTitle = node('title', { id: `${id}-title` }, svg);
    svgTitle.textContent = title;
    const svgDesc = node('desc', { id: `${id}-desc` }, svg);
    svgDesc.textContent = description;
    const defs = node('defs', {}, svg);
    const gradient = node('radialGradient', { id: `${id}-gold` }, defs);
    node('stop', { offset: '0', 'stop-color': '#d9b77d', 'stop-opacity': '.23' }, gradient);
    node('stop', { offset: '1', 'stop-color': '#d9b77d', 'stop-opacity': '0' }, gradient);
    const curseGradient = node('radialGradient', { id: `${id}-curse` }, defs);
    node('stop', { offset: '0', 'stop-color': '#bc769a', 'stop-opacity': '.25' }, curseGradient);
    node('stop', { offset: '1', 'stop-color': '#bc769a', 'stop-opacity': '0' }, curseGradient);
    const camera = node('g', { class: 'feedback-scene-camera' }, svg);
    node('path', { d: 'M40,302 H680 M105,324 H615 M185,345 H535', class: 'feedback-ground' }, camera);
    for (let x = 110; x < 710; x += 100) {
      node('path', { d: `M${x},302 L${360 + (x - 360) * 1.8},390`, class: 'feedback-ground-grid' }, camera);
    }
    node('path', { d: 'M42,44 H89 M42,44 V79 M678,44 H631 M678,44 V79', class: 'feedback-stage-corners' }, svg);
    const scene = node('g', {}, camera);
    const kicker = node('text', { x: '360', y: '355', 'text-anchor': 'middle', class: 'feedback-stage-kicker' }, svg);
    const caption = section.querySelector('.feedback-scene-caption p');
    const phase = section.querySelector('.feedback-scene-phase');
    const marks = [...section.querySelectorAll('.feedback-scene-steps li')];
    let previous = '';
    return {
      section, svg, scene, camera, id, kicker,
      explain(label, text, step) {
        const key = `${label}|${text}|${step}`;
        if (key === previous) return;
        previous = key;
        phase.textContent = label;
        caption.textContent = text;
        marks.forEach((mark, index) => {
          mark.classList.toggle('is-current', index === step);
          mark.classList.toggle('is-past', index < step);
        });
      }
    };
  }
  function stick(parent, color, hasSword = false) {
    const group = node('g', { class: 'feedback-stick', color }, parent);
    const shadow = node('ellipse', { cx: '0', cy: '2', rx: '47', ry: '6', class: 'feedback-stick-shadow' }, group);
    const sheath = hasSword ? node('path', { class: 'feedback-sheath' }, group) : null;
    const farArm = node('path', { class: 'feedback-stick-limb feedback-stick-far' }, group);
    const farLeg = node('path', { class: 'feedback-stick-limb feedback-stick-far' }, group);
    const torso = node('path', { class: 'feedback-stick-body' }, group);
    const nearLeg = node('path', { class: 'feedback-stick-limb' }, group);
    const nearArm = node('path', { class: 'feedback-stick-limb' }, group);
    const head = node('circle', { r: '13', class: 'feedback-stick-head' }, group);
    const eye = node('path', { class: 'feedback-stick-eye' }, group);
    const feet = node('path', { class: 'feedback-stick-feet' }, group);
    let sword, blade;
    if (hasSword) {
      sword = node('g', {}, group);
      node('path', { d: 'M-20,0 H5 M5,-7 V7', class: 'feedback-sword-grip' }, sword);
      blade = node('g', {}, sword);
      node('path', { d: 'M6,0 Q70,-1 116,-9', class: 'feedback-sword-blade' }, blade);
      node('path', { d: 'M6,2 Q70,1 116,-9', class: 'feedback-sword-edge' }, blade);
    }
    return {
      group,
      render(pose) {
        attr(group, { transform: `translate(${pose.x.toFixed(2)},302)` });
        attr(shadow, { rx: 43 + Math.abs(pose.ra[0] - pose.la[0]) * .12 });
        attr(head, { cx: pose.h[0], cy: pose.h[1] });
        attr(eye, { d: path([[pose.h[0] + 6, pose.h[1] - 2], [pose.h[0] + 10, pose.h[1] - 2]]) });
        attr(torso, { d: path([pose.n, pose.hip]) });
        attr(farArm, { d: path([pose.ls, pose.le, pose.lw]) });
        attr(nearArm, { d: path([pose.rs, pose.re, pose.rw]) });
        attr(farLeg, { d: path([pose.hip, pose.lk, pose.la]) });
        attr(nearLeg, { d: path([pose.hip, pose.rk, pose.ra]) });
        attr(feet, { d: `${path([pose.la, [pose.la[0] + 14, pose.la[1]]])} ${path([pose.ra, [pose.ra[0] + 15, pose.ra[1]]])}` });
        if (sword) {
          attr(sheath, { d: path([[pose.hip[0] + 15, pose.hip[1] - 5], [pose.hip[0] - 82, pose.hip[1] + 12]]), opacity: pose.sheath });
          attr(sword, { transform: `translate(${pose.rw[0]},${pose.rw[1]}) rotate(${pose.angle})` });
          attr(blade, { transform: `scale(${pose.blade.toFixed(4)},1)`, opacity: pose.blade > .01 ? 1 : 0 });
        }
      }
    };
  }
  const READY = {
    x: 228, h: [-1, -125], n: [0, -107], hip: [-6, -52],
    ls: [-6, -101], le: [-28, -77], lw: [-22, -52],
    rs: [7, -101], re: [22, -88], rw: [33, -70],
    lk: [-23, -27], la: [-34, 0], rk: [20, -28], ra: [37, 0],
    angle: -48, blade: 1, sheath: .35
  };
  const SHEATH = {
    ...READY, h: [14, -110], n: [10, -92], hip: [-8, -42],
    ls: [0, -86], le: [-20, -63], lw: [-5, -49],
    rs: [16, -86], re: [34, -65], rw: [7, -48],
    lk: [-20, -18], la: [-43, 0], rk: [40, -24], ra: [59, 0],
    angle: 170, blade: 0, sheath: 1
  };
  const STRIKE = {
    ...SHEATH, x: 347, h: [35, -105], n: [25, -87], hip: [-1, -45],
    ls: [15, -81], le: [-28, -67], lw: [-5, -48],
    rs: [26, -83], re: [59, -76], rw: [94, -83],
    lk: [-42, -18], la: [-72, 0], rk: [62, -22], ra: [95, 0],
    angle: -5, blade: 1
  };

  // ---------- 动作确认：普通挥砍、纳刀、局部确认、慢镜与前斩 ----------
  function actionScene(host) {
    const view = stage(host, 'action', '让有效动作，被看见',
      '一次局部回应，把操作与收益连起来。',
      ['挥砍', '纳刀', '有效确认', '前斩'],
      '火柴人的居合是动作表达示例。圆圈仅示意有效事件成立后的确认；不代表居合必定触发某个徽记，也不按每段伤害重复提示。');
    const aura = node('ellipse', { cx: '270', cy: '235', rx: '155', ry: '108', fill: `url(#${view.id}-gold)`, opacity: '0' }, view.scene);
    const actor = stick(view.scene, '#e8e6df', true);
    const trails = node('g', { class: 'feedback-slash-trails', opacity: '0' }, view.scene);
    const mainTrail = node('path', { class: 'feedback-slash-main' }, trails);
    const sideTrail = node('path', { class: 'feedback-slash-side' }, trails);
    const dash = node('path', { d: 'M125,294 H222 M148,280 H218 M164,306 H265', class: 'feedback-dash', opacity: '0' }, view.scene);
    const rings = node('g', { opacity: '0' }, view.scene);
    const ring1 = node('circle', { r: '31', class: 'feedback-confirm-ring' }, rings);
    const ring2 = node('circle', { r: '46', class: 'feedback-confirm-ring feedback-confirm-ring-outer' }, rings);
    const ringCorners = node('path', { d: 'M-38,-11 V-27 H-22 M22,-27 H38 V-11 M-38,11 V27 H-22 M22,27 H38 V11', class: 'feedback-confirm-ticks' }, rings);
    node('path', { d: 'M39,-17 L65,-27 H78', class: 'feedback-confirm-ticks' }, rings);
    const ringLabel = node('text', { x: '85', y: '-22', 'text-anchor': 'start', class: 'feedback-stage-label' }, rings);
    ringLabel.textContent = '有效事件成立';
    const frames = [
      frame(0, READY), frame(.65, READY),
      frame(1.1, READY, { h: [-6, -126], re: [-9, -122], rw: [-29, -144], angle: -90 }),
      frame(1.58, READY, { h: [13, -119], n: [8, -102], re: [39, -78], rw: [74, -58], angle: 37 }),
      frame(2.15, READY, { h: [0, -124], re: [-6, -119], rw: [-29, -137], angle: -120 }),
      frame(2.65, READY, { h: [15, -118], n: [9, -100], re: [42, -102], rw: [76, -107], angle: 9 }),
      frame(3.2, READY, { rw: [23, -55], re: [38, -73], angle: 124, sheath: .7 }),
      frame(4.1, SHEATH), frame(5.2, SHEATH),
      frame(6.6, SHEATH, { h: [19, -108], n: [14, -90], rw: [10, -49], re: [39, -65], rk: [44, -24] }),
      frame(7.35, SHEATH, { h: [25, -106], n: [19, -88], x: 239, rw: [17, -48], re: [42, -65] }),
      frame(7.75, STRIKE, { x: 300, rw: [70, -111], re: [45, -105], angle: -29 }),
      frame(8.1, STRIKE), frame(9.7, STRIKE),
      frame(10.7, STRIKE, { h: [27, -111], n: [17, -93], rw: [69, -68], re: [41, -74], angle: 15 }),
      frame(11.2, STRIKE), frame(11.95, READY), frame(12, READY)
    ];
    let progress = 0;
    function render(p, elapsed) {
      progress = p;
      const time = typeof elapsed === 'number' ? elapsed : p * 12;
      const pose = interpolate(frames, time);
      actor.render(pose);
      const zoom = 1 + .13 * ramp(time, 5.15, 6.4) * (1 - ramp(time, 10.5, 11.3));
      attr(view.camera, { transform: `translate(360,220) scale(${zoom.toFixed(4)}) translate(-360,-220)` });
      const resetFade = time > 10.9 ? 1 - .93 * ramp(time, 10.9, 11.25) + .93 * ramp(time, 11.6, 12) : 1;
      attr(view.scene, { opacity: resetFade });
      const confirm = ramp(time, 4.35, 4.8) * (1 - ramp(time, 7.35, 7.85));
      attr(rings, { transform: `translate(${pose.x + pose.rw[0]},${302 + pose.rw[1]})`, opacity: confirm });
      const beat = Math.sin((time - 4.3) * 4.2);
      attr(ring1, { r: 31 + beat * 2.2 });
      attr(ring2, { r: 45 + beat * 2.8, opacity: .35 + .1 * beat });
      attr(ringCorners, { opacity: .8 });
      attr(aura, { cx: pose.x + 18, opacity: confirm * .6 });
      let flash = 0, trail = '', side = '';
      if (time > 1.13 && time < 1.83) {
        flash = Math.sin(clamp((time - 1.13) / .7) * Math.PI);
        trail = 'M190,128 Q358,120 372,261';
        side = 'M187,136 Q347,138 359,264';
      } else if (time > 2.26 && time < 2.94) {
        flash = Math.sin(clamp((time - 2.26) / .68) * Math.PI);
        trail = 'M181,136 Q309,115 392,212';
        side = 'M180,145 Q300,132 382,219';
      } else if (time > 7.58 && time < 8.6) {
        flash = Math.sin(clamp((time - 7.58) / 1.02) * Math.PI);
        trail = 'M289,215 Q472,143 581,224';
        side = 'M303,228 Q481,177 576,239';
      }
      attr(trails, { opacity: flash });
      attr(mainTrail, { d: trail });
      attr(sideTrail, { d: side });
      attr(dash, { opacity: ramp(time, 7.45, 7.75) * (1 - ramp(time, 8.2, 8.65)) });
      view.kicker.textContent = time > 4.35 && time < 7.5 ? '局部确认 · 看清动作与回应' : time >= 7.5 && time < 10.9 ? '前斩完成 · 保留一次主要确认' : '动作轮廓 · 不增加新的计数器';
      if (time < 2.95) view.explain('普通挥砍', '先保留清楚的动作轮廓；每次挥刀都亮起成功提示，会让真正的收益淹没。', 0);
      else if (time < 4.4) view.explain('纳刀准备', '收刀、降低重心，构成可记忆的居合前摇。', 1);
      else if (time < 5.25) view.explain('有效确认', '有效事件成立，刀旁圆环回应一次。确认与结果相连。', 2);
      else if (time < 7.5) view.explain('关键瞬间放慢', '镜头稍近、动作放慢，让玩家看清动作与反馈的对应。', 2);
      else view.explain('前斩完成', '表现结束后及时收敛；连锁与自动输出不冒充新的直接动作成功。', 3);
    }
    const motion = window.CaseMotion.mount(view.section, { duration: 12, render });
    return { motion, getState: () => ({ progress, ...motion.getState() }) };
  }

  // ---------- 状态可见：姿态、自身环身增益、目标印记与同步退出 ----------
  function stateScene(host) {
    const view = stage(host, 'state', '让作用对象，一眼可辨',
      '自身变强与目标变弱，用不同表现表达。',
      ['祈祷', '自身增益', '目标减益', '同步消退'],
      '祈祷是抽象动作，不是游戏施法规则。金色／青玉环身表示自身增益，紫红印记表示目标减益；表现绑定实际状态，结束时同步消退。');
    const ownAura = node('ellipse', { cx: '218', cy: '226', rx: '99', ry: '121', fill: `url(#${view.id}-gold)`, opacity: '0' }, view.scene);
    const targetAura = node('ellipse', { cx: '510', cy: '232', rx: '81', ry: '114', fill: `url(#${view.id}-curse)`, opacity: '0' }, view.scene);
    const ownRings = node('g', { opacity: '0', class: 'feedback-buff-rings' }, view.scene);
    const buffEllipses = [
      node('ellipse', { cx: '218', cy: '292', rx: '57', ry: '16', class: 'feedback-buff-ring' }, ownRings),
      node('ellipse', { cx: '218', cy: '241', rx: '47', ry: '13', class: 'feedback-buff-ring feedback-buff-jade' }, ownRings),
      node('ellipse', { cx: '218', cy: '206', rx: '38', ry: '11', class: 'feedback-buff-ring' }, ownRings)
    ];
    const particles = Array.from({ length: 10 }, () => node('circle', { r: '2.1', class: 'feedback-buff-spark' }, ownRings));
    const own = stick(view.scene, '#e8e6df');
    const enemy = stick(view.scene, '#bcb9b3');
    const curse = node('g', { opacity: '0' }, view.scene);
    node('path', { d: 'M486,209 L501,221 L493,237 M535,210 L520,221 L527,237 M498,239 L510,249 L522,239', class: 'feedback-curse-mark' }, curse);
    const curseRing = node('ellipse', { cx: '510', cy: '290', rx: '51', ry: '14', class: 'feedback-curse-ring' }, curse);
    node('path', { d: 'M489,137 L499,147 L510,135 L521,147 L531,137 M498,151 L510,162 L522,151', class: 'feedback-curse-crown' }, curse);
    const wave = node('path', { d: 'M242,211 Q358,144 480,211', class: 'feedback-state-link', opacity: '0' }, view.scene);
    const waveDot = node('circle', { r: '4', class: 'feedback-state-dot', opacity: '0' }, view.scene);
    const ownLabel = node('text', { x: '218', y: '129', 'text-anchor': 'middle', class: 'feedback-stage-label feedback-label-jade', opacity: '0' }, view.scene);
    ownLabel.textContent = '自身 · 增益';
    const enemyLabel = node('text', { x: '510', y: '108', 'text-anchor': 'middle', class: 'feedback-stage-label feedback-label-curse', opacity: '0' }, view.scene);
    enemyLabel.textContent = '目标 · 减益';
    const ownName = node('text', { x: '218', y: '326', 'text-anchor': 'middle', class: 'feedback-actor-name' }, view.scene);
    ownName.textContent = '我方';
    const enemyName = node('text', { x: '510', y: '326', 'text-anchor': 'middle', class: 'feedback-actor-name' }, view.scene);
    enemyName.textContent = '敌方';
    const ownReady = { ...READY, x: 218, rw: [27, -58], re: [27, -83], lw: [-22, -52] };
    const prayer = {
      ...ownReady, h: [9, -121], n: [4, -102], hip: [-4, -51],
      ls: [-7, -96], le: [-22, -77], lw: [11, -102],
      rs: [10, -96], re: [29, -78], rw: [13, -101]
    };
    const bowed = { ...prayer, h: [16, -115], n: [9, -98], rs: [15, -93], ls: [-1, -93], rw: [20, -96], lw: [18, -97] };
    const enemyReady = { ...READY, x: 510, h: [-3, -126], re: [21, -80], rw: [26, -50], le: [-22, -79], lw: [-30, -56] };
    const enemyAffected = {
      ...enemyReady, h: [-13, -112], n: [-10, -94], hip: [-6, -48],
      rs: [-2, -91], re: [24, -82], rw: [8, -105],
      ls: [-15, -91], le: [-35, -69], lw: [-20, -90],
      lk: [-29, -24], la: [-42, 0], rk: [22, -25], ra: [38, 0]
    };
    const ownFrames = [frame(0, ownReady), frame(.8, ownReady), frame(1.9, prayer), frame(3, bowed), frame(4.2, bowed), frame(5.2, prayer), frame(6.15, ownReady), frame(10.8, ownReady)];
    const targetFrames = [frame(0, enemyReady), frame(4.65, enemyReady), frame(5.4, enemyAffected), frame(6.3, enemyAffected, { h: [-10, -115], rw: [11, -100] }), frame(8.1, enemyAffected), frame(9.5, enemyReady), frame(10.8, enemyReady)];
    let progress = 0;
    function render(p, elapsed) {
      progress = p;
      const time = typeof elapsed === 'number' ? elapsed : p * 10.8;
      own.render(interpolate(ownFrames, time));
      enemy.render(interpolate(targetFrames, time));
      const ending = 1 - ramp(time, 8.45, 9.65);
      const buff = ramp(time, 3.25, 4.35) * ending;
      const debuff = ramp(time, 4.65, 5.5) * ending;
      attr(ownAura, { opacity: buff });
      attr(targetAura, { opacity: debuff });
      attr(ownRings, { opacity: buff });
      attr(curse, { opacity: debuff });
      attr(ownLabel, { opacity: buff });
      attr(enemyLabel, { opacity: debuff });
      attr(own.group, { color: buff > .1 ? '#b3dacb' : '#e8e6df' });
      attr(enemy.group, { color: debuff > .1 ? '#cab4c0' : '#bcb9b3' });
      buffEllipses.forEach((ellipse, index) => {
        const pulse = Math.sin(time * 1.9 - index * 1.3);
        attr(ellipse, { rx: [57, 47, 38][index] + pulse * 3, ry: [16, 13, 11][index] + pulse });
      });
      particles.forEach((particle, index) => {
        const angle = time * .75 + index * Math.PI * 2 / particles.length;
        attr(particle, { cx: 218 + Math.cos(angle) * (42 + index % 3 * 5), cy: 191 + index * 9 + Math.sin(angle) * 8, opacity: .3 + .55 * (1 + Math.sin(angle)) / 2 });
      });
      attr(curseRing, { rx: 51 + Math.sin(time * 2) * 2, 'stroke-dashoffset': (time * -9).toFixed(2) });
      const link = ramp(time, 4.15, 4.45) * (1 - ramp(time, 5.15, 5.6));
      attr(wave, { opacity: link * .65 });
      const travel = clamp((time - 4.25) / 1.03);
      attr(waveDot, { cx: mix(242, 480, travel), cy: 211 - Math.sin(travel * Math.PI) * 34, opacity: time >= 4.25 && time <= 5.3 ? Math.sin(travel * Math.PI) : 0 });
      view.kicker.textContent = time < 3.3 ? '同一动作 · 显示不同作用对象' : time < 8.45 ? '持续表现 · 不遮挡动作轮廓' : '状态结束 · 反馈同步清除';
      if (time < 3.25) view.explain('祈祷动作', '先让动作成立，再表达状态变化。祈祷只是本动画的抽象动作。', 0);
      else if (time < 4.65) view.explain('自身增益', '金色与青玉环身亮起，让玩家直接看见“我获得了增益”。', 1);
      else if (time < 8.45) view.explain('目标减益', '紫红印记留在敌方，和自身光环分开；状态对象、持续和强弱可辨。', 2);
      else view.explain('同步消退', '两种实际状态结束，表现同步淡出，避免留下已经失效的提示。', 3);
    }
    const motion = window.CaseMotion.mount(view.section, { duration: 10.8, render });
    return { motion, getState: () => ({ progress, ...motion.getState() }) };
  }

  window.WuwaFeedbackScenes = {
    mount({ actionHost, stateHost }) {
      if (!actionHost || !stateHost) throw new Error('反馈动画缺少动作或状态宿主。');
      if (!window.CaseMotion?.mount) throw new Error('反馈动画需要共享 CaseMotion 时钟。');
      actionHost.innerHTML = '';
      stateHost.innerHTML = '';
      const scenes = [actionScene(actionHost), stateScene(stateHost)];
      return {
        getState: () => ({ action: scenes[0].getState(), state: scenes[1].getState() }),
        setProgress(progress) { scenes.forEach((scene) => scene.motion.setProgress(clamp(progress))); },
        destroy() { scenes.forEach((scene) => scene.motion.destroy()); actionHost.innerHTML = ''; stateHost.innerHTML = ''; }
      };
    }
  };
}());
