/*
 * [INPUT]: CaseMotion 可见性/低动态时钟、共享确认框视觉及有效普通攻击的条件表达。
 * [OUTPUT]: WuwaBoxingScene.mount，普通攻击的微量确认、位置标注与蓄力重击对照。
 * [POS]: dist 动作反馈对比栏的高频舞台；与居合共用标注语言，接触不等于游戏触发判定。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const DURATION = 14;
  const NORMAL = [1.15, 1.7, 2.65, 3.2, 4.15, 4.7];
  const HEAVY = 8.3;
  const FLOOR = 310;
  const PIVOT = { x: 439, y: 55 };
  const CONTACT = { x: -43, y: 154 };
  const GLOVE_EDGE = 7;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const lerp = (a, b, p) => a + (b - a) * p;
  const smooth = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const ramp = (time, start, end) => smooth((time - start) / (end - start));
  let serial = 0;

  function node(name, attrs = {}, parent) {
    const element = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (parent) parent.appendChild(element);
    return element;
  }
  function attr(element, values) {
    Object.entries(values).forEach(([key, value]) => element.setAttribute(key, value));
  }
  function line(points) {
    return points.map((point, i) => `${i ? 'L' : 'M'}${point[0].toFixed(3)},${point[1].toFixed(3)}`).join(' ');
  }
  function poseMix(before, after, weight) {
    const output = {};
    Object.keys(before).forEach((key) => {
      output[key] = Array.isArray(before[key])
        ? before[key].map((value, i) => lerp(value, after[key][i], weight))
        : lerp(before[key], after[key], weight);
    });
    return output;
  }

  // ---------- 同一袋体几何驱动接触点和冲量后的摆动 ----------
  function bagAngle(time) {
    let angle = 0;
    NORMAL.forEach((impact) => {
      const after = time - impact;
      if (after >= 0) angle -= .036 * Math.exp(-1.75 * after) * Math.sin(8.8 * after);
    });
    const afterHeavy = time - HEAVY;
    if (afterHeavy >= 0) angle -= .18 * Math.exp(-.83 * afterHeavy) * Math.sin(3.8 * afterHeavy);
    return angle;
  }
  function contactPoint(angle) {
    return {
      x: PIVOT.x + CONTACT.x * Math.cos(angle) - CONTACT.y * Math.sin(angle),
      y: PIVOT.y + CONTACT.x * Math.sin(angle) + CONTACT.y * Math.cos(angle)
    };
  }
  function attackWeight(time, hit, heavy = false) {
    const before = heavy ? .38 : .2;
    const hold = heavy ? .1 : .07;
    const returning = heavy ? .72 : .23;
    const after = time - hit;
    if (after < -before || after > hold + returning) return 0;
    if (after < 0) return smooth((after + before) / before);
    if (after <= hold) return 1;
    return 1 - smooth((after - hold) / returning);
  }
  const GUARD = {
    x: 268, h: [5, -125], n: [3, -107], hip: [-6, -48],
    ls: [-3, -100], le: [-14, -78], lw: [23, -109],
    rs: [10, -100], re: [32, -77], rw: [37, -114],
    lk: [-32, -24], la: [-49, 0], rk: [28, -26], ra: [54, 0]
  };
  const CHARGE = {
    ...GUARD, x: 256, h: [-11, -126], n: [-7, -108], hip: [-5, -45],
    ls: [-14, -101], le: [-26, -76], lw: [12, -105],
    rs: [0, -99], re: [-37, -83], rw: [-30, -116],
    lk: [-39, -23], la: [-65, 0], rk: [33, -23], ra: [65, 0]
  };
  function normalPose(contact, left) {
    const pose = {
      ...GUARD, x: left ? 289 : 286,
      h: [17, -123], n: [15, -105], hip: [0, -48],
      ls: [8, -100], le: [5, -76], lw: [33, -109],
      rs: [23, -100], re: [34, -75], rw: [43, -113],
      lk: [-29, -23], la: [-49, 0], rk: [33, -24], ra: [58, 0]
    };
    const hand = [contact.x - GLOVE_EDGE - pose.x, contact.y - FLOOR];
    if (left) {
      pose.h = [21, -121]; pose.n = [18, -103];
      pose.ls = [20, -102]; pose.le = [lerp(20, hand[0], .48), hand[1] - 5]; pose.lw = hand;
    } else {
      pose.re = [lerp(23, hand[0], .5), hand[1] + 7]; pose.rw = hand;
    }
    return pose;
  }
  function heavyPose(contact) {
    const pose = {
      ...GUARD, x: 300, h: [28, -119], n: [24, -101], hip: [7, -43],
      ls: [14, -97], le: [-7, -72], lw: [35, -104],
      rs: [31, -97], re: [64, -95], rw: [91, -101],
      lk: [-26, -18], la: [-64, 0], rk: [57, -21], ra: [80, 0]
    };
    pose.rw = [contact.x - GLOVE_EDGE - pose.x, contact.y - FLOOR];
    pose.re = [lerp(pose.rs[0], pose.rw[0], .55), pose.rw[1] + 7];
    return pose;
  }

  // ---------- 拳手姿态：关节、脚步、拳套共享同一接触位置 ----------
  function boxer(parent) {
    const group = node('g', { class: 'boxing-figure' }, parent);
    const shadow = node('ellipse', { cx: '0', cy: '3', rx: '63', ry: '7', class: 'boxing-shadow' }, group);
    const farArm = node('path', { class: 'boxing-limb boxing-limb-far' }, group);
    const farLeg = node('path', { class: 'boxing-limb boxing-limb-far' }, group);
    const torso = node('path', { class: 'boxing-torso' }, group);
    const nearLeg = node('path', { class: 'boxing-limb' }, group);
    const nearArm = node('path', { class: 'boxing-limb' }, group);
    const feet = node('path', { class: 'boxing-feet' }, group);
    const head = node('circle', { r: '13', class: 'boxing-head' }, group);
    const eye = node('path', { class: 'boxing-eye' }, group);
    const farGlove = node('circle', { r: '6', class: 'boxing-glove boxing-glove-far' }, group);
    const nearGlove = node('circle', { r: '6', class: 'boxing-glove' }, group);
    return {
      render(pose) {
        attr(group, { transform: `translate(${pose.x.toFixed(3)},${FLOOR})` });
        attr(shadow, { rx: 48 + (pose.ra[0] - pose.la[0]) * .12 });
        attr(farArm, { d: line([pose.ls, pose.le, pose.lw]) });
        attr(nearArm, { d: line([pose.rs, pose.re, pose.rw]) });
        attr(farLeg, { d: line([pose.hip, pose.lk, pose.la]) });
        attr(nearLeg, { d: line([pose.hip, pose.rk, pose.ra]) });
        attr(torso, { d: line([pose.n, pose.hip]) });
        attr(feet, { d: `${line([pose.la, [pose.la[0] + 16, pose.la[1]]])} ${line([pose.ra, [pose.ra[0] + 17, pose.ra[1]]])}` });
        attr(head, { cx: pose.h[0], cy: pose.h[1] });
        attr(eye, { d: line([[pose.h[0] + 5, pose.h[1] - 2], [pose.h[0] + 10, pose.h[1] - 2]]) });
        attr(farGlove, { cx: pose.lw[0], cy: pose.lw[1] });
        attr(nearGlove, { cx: pose.rw[0], cy: pose.rw[1] });
      }
    };
  }
  function sandbag(parent) {
    const group = node('g', { class: 'boxing-bag' }, parent);
    node('path', { d: 'M0,0 V49 M0,49 L-25,84 M0,49 L25,84', class: 'boxing-chain' }, group);
    for (let y = 7; y <= 43; y += 10) node('ellipse', { cx: '0', cy: y, rx: '3', ry: '5', class: 'boxing-chain-link' }, group);
    node('path', { d: 'M-25,84 V96 M25,84 V96', class: 'boxing-bag-strap' }, group);
    node('rect', { x: '-43', y: '84', width: '86', height: '154', rx: '29', class: 'boxing-bag-shell' }, group);
    node('path', { d: 'M-34,105 Q0,113 34,105 M-35,213 Q0,205 35,213', class: 'boxing-bag-seam' }, group);
    node('path', { d: 'M24,118 V195', class: 'boxing-bag-side' }, group);
    node('circle', { cx: '0', cy: '154', r: '22', class: 'boxing-bag-target' }, group);
    node('circle', { cx: '0', cy: '154', r: '9', class: 'boxing-bag-target' }, group);
    return { render(angle) { attr(group, { transform: `translate(${PIVOT.x},${PIVOT.y}) rotate(${(angle * 180 / Math.PI).toFixed(6)})` }); } };
  }

  window.WuwaBoxingScene = {
    mount(host) {
      if (!host || !window.CaseMotion?.mount) throw new Error('拳击舞台需要宿主与 CaseMotion。');
      host.innerHTML = '';
      host.classList.add('boxing-scene-root');
      const section = document.createElement('section');
      section.className = 'boxing-scene';
      section.innerHTML = '<header class="boxing-heading"><span>高频动作 · 普通攻击</span><h4>克制的确认，也能清楚可辨</h4><p>有效普通攻击有小回应，蓄力重击不产生同类确认。</p></header><div class="boxing-screen"></div><div class="boxing-explanation"><div class="boxing-caption"><span class="boxing-phase"></span><p></p></div><p class="boxing-principle"><i aria-hidden="true"></i><span><strong>短、小、稳定</strong>高频收益用局部回应，不需要每次都放大镜头或制造强提示。</span></p></div><p class="boxing-boundary">以热焰这样的普攻入口为例，动画按满足条件的普通攻击展示。真实表现仍跟随收益生效及触发间隔；整组多段伤害可以合并确认，不能把每次命中都当成一次徽记触发。</p>';
      host.appendChild(section);
      const id = `boxing-${++serial}`;
      const svg = node('svg', { viewBox: '0 0 720 390', role: 'img', 'aria-labelledby': `${id}-title ${id}-description`, focusable: 'false' }, section.querySelector('.boxing-screen'));
      node('title', { id: `${id}-title` }, svg).textContent = '普通攻击的小反馈与蓄力重击的条件辨识';
      node('desc', { id: `${id}-description` }, svg).textContent = '拳手用六次左右交替的普通攻击击中悬挂沙袋，每次有效接触仅在拳套和沙袋相接处出现短小金色光点。四角框和引线标出普通攻击确认的位置；随后蓄力重击使沙袋更明显摆动，标注撤去，也不出现普通攻击的金色徽记确认。';
      node('path', { d: 'M85,310 H635 M135,335 H585 M215,357 H505', class: 'boxing-ground' }, svg);
      node('path', { d: 'M180,310 L135,380 M300,310 L275,380 M420,310 L430,380 M540,310 L585,380', class: 'boxing-ground-grid' }, svg);
      node('path', { d: 'M395,53 H484 M412,53 V43 M466,53 V43', class: 'boxing-beam' }, svg);
      node('path', { d: 'M37,38 H77 M37,38 V70 M683,38 H643 M683,38 V70', class: 'boxing-frame' }, svg);
      const bagShadow = node('ellipse', { cx: PIVOT.x, cy: '312', rx: '48', ry: '8', class: 'boxing-shadow' }, svg);
      const bag = sandbag(svg);
      const fighter = boxer(svg);
      const physicalMotion = node('g', { opacity: '0', class: 'boxing-physical-motion' }, svg);
      node('path', { d: 'M510,173 H535 M518,190 H550 M508,207 H531', class: 'boxing-bag-speed' }, physicalMotion);
      const cue = node('g', { opacity: '0', class: 'boxing-contact-cue' }, svg);
      node('circle', { r: '3.3', class: 'boxing-contact-light' }, cue);
      const cueArc = node('path', { d: 'M5,-10 Q15,0 5,10', class: 'boxing-contact-arc' }, cue);
      const cueRay = node('path', { d: 'M3,-6 L8,-11 M6,0 H13 M3,6 L8,11', class: 'boxing-contact-rays' }, cue);
      // ---------- 与居合共用四角框 / 引线：标注位置，不把文字变成每击提示 ----------
      const callout = node('g', { opacity: '0', class: 'boxing-confirm-callout' }, svg);
      node('path', { d: 'M-22,-5 V-17 H-10 M10,-17 H22 V-5 M-22,5 V17 H-10 M10,17 H22 V5', class: 'feedback-confirm-ticks' }, callout);
      node('path', { d: 'M23,-13 L53,-29 H78', class: 'feedback-confirm-ticks' }, callout);
      node('text', { x: '85', y: '-24', class: 'feedback-stage-label' }, callout).textContent = '普通攻击确认';
      const sceneLabel = node('text', { x: '505', y: '108', class: 'boxing-svg-phase' }, svg);
      const sceneRule = node('text', { x: '505', y: '135', class: 'boxing-svg-rule' }, svg);
      const floorLabel = node('text', { x: '360', y: '360', 'text-anchor': 'middle', class: 'boxing-svg-note' }, svg);
      const caption = section.querySelector('.boxing-caption p');
      const phaseLabel = section.querySelector('.boxing-phase');
      const reducedMotion = !!window.CaseMotion.getState?.().reducedMotion;
      let state = {}, previousPhase = '';
      function render(progress, elapsed) {
        const sourceTime = typeof elapsed === 'number' ? elapsed : progress * DURATION;
        // === 粗采样仍保留接触信息：每秒展示一张有效普通攻击关键帧 ===
        const representativeContact = reducedMotion && sourceTime < 5.7;
        const time = representativeContact ? NORMAL[Math.min(NORMAL.length - 1, Math.floor(sourceTime))] : sourceTime;
        section.dataset.boxingFrameMode = representativeContact ? 'contact' : 'continuous';
        const angle = bagAngle(time), point = contactPoint(angle);
        bag.render(angle);
        attr(bagShadow, { cx: PIVOT.x - Math.sin(angle) * 157 });
        let pose = { ...GUARD };
        let attack = null;
        NORMAL.forEach((hit, index) => {
          const weight = attackWeight(time, hit);
          if (weight > 0) {
            pose = poseMix(GUARD, normalPose(point, index % 2 === 0), weight);
            attack = { kind: 'normal', index, time: hit, weight, hand: index % 2 === 0 ? 'left' : 'right' };
          }
        });
        if (time > 5.7 && time <= HEAVY) pose = poseMix(GUARD, CHARGE, ramp(time, 5.7, 7.5));
        const heavyWeight = attackWeight(time, HEAVY, true);
        if (heavyWeight > 0) {
          pose = poseMix(time <= HEAVY ? CHARGE : GUARD, heavyPose(point), heavyWeight);
          attack = { kind: 'heavy', index: 0, time: HEAVY, weight: heavyWeight, hand: 'right' };
        }
        if (time > HEAVY + .82) pose = { ...GUARD };
        fighter.render(pose);
        let cueStrength = 0;
        NORMAL.forEach((hit) => {
          const after = time - hit;
          if (after >= 0 && after <= .14) cueStrength = Math.max(cueStrength, Math.pow(1 - after / .14, 1.3));
        });
        attr(cue, { transform: `translate(${point.x.toFixed(4)},${point.y.toFixed(4)})`, opacity: cueStrength });
        attr(cueArc, { transform: `scale(${(1 + (1 - cueStrength) * .2).toFixed(3)})` });
        attr(cueRay, { opacity: .7 });
        const calloutOpacity = time >= NORMAL[0] ? 1 - ramp(time, 5.1, 5.55) : 0;
        attr(callout, { transform: `translate(${point.x.toFixed(4)},${point.y.toFixed(4)})`, opacity: calloutOpacity });
        const strongReaction = ramp(time, HEAVY + .02, HEAVY + .15) * (1 - ramp(time, HEAVY + .4, HEAVY + .8));
        attr(physicalMotion, { opacity: strongReaction * .4 });
        let phase;
        if (time < 5.7) phase = 'normal';
        else if (time < HEAVY) phase = 'charge';
        else if (time < 10.2) phase = 'heavy';
        else phase = 'recover';
        const messages = {
          normal: ['普通攻击 · 条件成立', '拳头接触沙袋时，一个短小光点回应有效动作。连续命中也保持局部、克制。', '普通攻击', '小回应，清楚可辨', '高频有效动作 · 反馈不抢占动作'],
          charge: ['蓄力重击 · 准备动作', '同一个拳手蓄力、重心后移。动作更重，不代表普通攻击的收益条件已经满足。', '蓄力重击', '先辨认动作条件', '动作更重 ≠ 当前收益成立'],
          heavy: ['蓄力重击 · 条件不符', '沙袋反应更强，但没有同类金色确认。物理冲击与构筑收益，应该让玩家区分。', '重击命中', '没有普通攻击确认', '更强冲击 · 不伪造收益提示'],
          recover: ['条件辨识 · 保持一致', '普通攻击的确认与重击的缺席共同表达规则：反馈跟随有效条件，不跟随动作夸张程度。', '条件辨识', '有效动作才有回应', '短、小、稳定 · 与收益条件一致']
        };
        if (phase !== previousPhase) {
          previousPhase = phase;
          const message = messages[phase];
          phaseLabel.textContent = message[0]; caption.textContent = message[1];
          sceneLabel.textContent = message[2]; sceneRule.textContent = message[3]; floorLabel.textContent = message[4];
          section.dataset.boxingPhase = phase;
        }
        const hand = attack?.hand === 'left' ? pose.lw : pose.rw;
        const fist = { x: pose.x + hand[0], y: FLOOR + hand[1] };
        state = {
          progress, phase, sourceElapsed: sourceTime, visualTime: time, reducedMotion, representativeContact,
          cueActive: cueStrength > .001, cueKind: cueStrength > .001 ? 'normal' : null,
          calloutActive: calloutOpacity > .001, calloutOpacity,
          bagAngle: angle, contact: point, fist,
          contactError: Math.hypot(fist.x + GLOVE_EDGE - point.x, fist.y - point.y),
          activeAttack: attack, normalContacts: [...NORMAL], heavyContact: HEAVY, duration: DURATION
        };
      }
      const motion = window.CaseMotion.mount(section, { duration: DURATION, render });
      return {
        getState: () => ({ ...state, motion: motion.getState() }),
        setProgress: (progress) => motion.setProgress(clamp(Number(progress))),
        destroy() { motion.destroy(); host.innerHTML = ''; }
      };
    }
  };
}());
