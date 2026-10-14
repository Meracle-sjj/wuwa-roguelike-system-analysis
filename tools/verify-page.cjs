/**
 * [INPUT]: dist入口、章节对话框/关键文案/主观纵轴、动态组件及固定来源快照。
 * [OUTPUT]: 静态可移植性、正文覆盖和真实条件边界的验证报告，不代替浏览器视觉检查。
 * [POS]: tools的本地核验入口；用file URL装配页面以验证无服务端依赖的阅读交互。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { JSDOM, VirtualConsole } = require(process.env.WUWA_JSDOM_PATH || 'jsdom');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const checks = [];
const check = (name, fn) => { fn(); checks.push({name,passed:true}); };
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const normalize = value => value.replace(/\s+/gu,'');

// === 真正执行本地经典脚本，采集初始化异常 ===
(async () => {
  const errors = [];
  let currentTime=0, frameSerial=0;
  const pendingFrames=new Map();
  const visibilityCallbacks=[];
  const frame=(milliseconds=50)=>{
    currentTime+=milliseconds;
    const callbacks=[...pendingFrames.values()];pendingFrames.clear();
    callbacks.forEach(callback=>callback(currentTime));
  };
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = await JSDOM.fromFile(path.join(dist,'index.html'), {
    runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:console,
    beforeParse(window) {
      window.matchMedia = () => ({matches:false});
      window.requestAnimationFrame = callback => {const id=++frameSerial;pendingFrames.set(id,callback);return id;};
      window.cancelAnimationFrame = id => pendingFrames.delete(id);
      window.IntersectionObserver = class {
        constructor(callback){this.callback=callback;visibilityCallbacks.push(this);this.targets=new Set();}
        observe(target){this.targets.add(target);this.callback([{target,isIntersecting:true,intersectionRatio:1,boundingClientRect:{top:100}}]);}
        unobserve(target){this.targets.delete(target);}
        disconnect(){this.targets.clear();}
      };
      window.HTMLElement.prototype.getBoundingClientRect = () => ({top:100,bottom:500,left:0,right:800,width:800,height:400});
      window.HTMLElement.prototype.scrollIntoView = () => {};
      window.HTMLDialogElement.prototype.showModal = function() { this.open=true; };
      window.HTMLDialogElement.prototype.close = function() { this.open=false; this.dispatchEvent(new window.Event('close')); };
    }
  });
  const win = dom.window;
  await new Promise(resolve => win.document.readyState==='complete' ? resolve() : win.addEventListener('load',resolve,{once:true}));
  const doc = win.document;
  const $ = selector => doc.querySelector(selector);
  const $$ = selector => [...doc.querySelectorAll(selector)];
  check('离线file URL成功初始化，无脚本异常', () => { assert.deepEqual(errors,[]); assert.ok(win.WuwaPage.rhythm); });
  check('六章、八原图来源、四局记录与章节入口已装配', () => {
    assert.equal($$('section.chapter').length,6);
    assert.equal(win.WuwaContent.figures.length,8);
    assert.equal($$('[data-open-article]').length,6);
    assert.equal($$('#record-list button').length,4);
    assert.ok(win.WuwaContent.methodHtml.includes('来源'));
    assert.ok(win.WuwaContent.auditHtml.includes('霜灭'));
  });
  check('六章原文改为按需对话框，原文文字无删节', () => {
    for(const section of win.WuwaContent.article.sections) {
      const trigger=$(`[data-open-article="${section.id}"]`);trigger.click();
      assert.equal($('#document-dialog').open,true);
      assert.equal($('#document-dialog-title').textContent,section.title);
      const copy=$('#document-dialog-body').cloneNode(true);
      copy.querySelector('.source-document-link').remove();
      const parsed=new JSDOM(section.html).window.document.body.textContent;
      assert.equal(normalize(copy.textContent),normalize(parsed));
      $('#document-dialog [data-close-dialog]').click();
      assert.equal(doc.activeElement,trigger);
    }
    assert.ok(win.WuwaContent.article.introHtml.length>0);
  });
  check('关键机制与探索空间突出，系统推荐/测试目的取代旧文案', () => {
    assert.equal($$('.key-statement').length,2);
    assert.ok($('#entry .key-statement').textContent.includes('动作成为触发入口'));
    assert.ok($('#build .key-statement').textContent.includes('深度探索'));
    const text=$('#build').textContent;
    assert.ok(text.includes('不愿详细阅读效果的玩家'));assert.ok(text.includes('每周奖励'));
    assert.ok(text.includes('系统推荐'));assert.ok(!text.includes('大拇指'));
    assert.ok(!text.includes('19次不含开局和商店'));
  });
  check('全部本地链接、图片、脚本、样式与页内锚点存在', () => {
    for (const element of $$('[href],[src]')) {
      const value = element.getAttribute('href') || element.getAttribute('src');
      if (!value || /^(?:https?:|mailto:)/u.test(value)) continue;
      if (value.startsWith('#')) { assert.ok(doc.getElementById(decodeURIComponent(value.slice(1))),`缺少锚点 ${value}`); continue; }
      const local = new URL(value,pathToFileURL(path.join(dist,'index.html')));
      assert.equal(local.protocol,'file:');
      assert.ok(fs.existsSync(decodeURIComponent(local.pathname)),`缺少文件 ${value}`);
    }
    assert.equal($$('script[src]').filter(e => /^https?:/u.test(e.src)).length,0);
  });
  check('02保留四组13来源到12徽记，坚盾是单节点双来源', () => {
    assert.equal($$('[data-hierarchy-source]').length,13);assert.equal($$('[data-hierarchy-badge]').length,12);
    assert.equal($$('[data-hierarchy-edge]').length,13);assert.equal($$('[data-hierarchy-badge="shield"]').length,1);
    assert.equal($$('[data-hierarchy-target="shield"]').length,2);
    assert.equal($$('[data-hierarchy-kind="gold"]').length,4);assert.equal($$('[data-hierarchy-kind="jade"]').length,8);
    assert.equal(win.WuwaPage.hierarchy.getState().groups.length,4);
  });
  check('两类基础节奏标明预期体验纵轴与非测量范围', () => {
    assert.equal($$('[data-hierarchy-metric="expected-experience"]').length,2);
    assert.equal($$('.hierarchy-baseline-y-axis').length,2);
    assert.ok($$('.hierarchy-baseline-axis-label').every(label=>label.textContent==='预期体验'));
    assert.ok($$('.hierarchy-baseline-measurement').every(label=>label.textContent==='非实际测量'));
    assert.ok($('.hierarchy-scope').textContent.includes('本人分析分组'));
  });
  frame();frame(80);
  check('可见即自动播放，页面不提供启动/拖动门槛', () => {
    assert.ok(win.WuwaPage.selection.getState().motion.playing);
    assert.ok(win.WuwaPage.selection.getState().progress>0);
    assert.ok(win.WuwaPage.rhythm.getState().playing);
    assert.equal($$('[data-rhythm-play],[data-rhythm-range],[data-feedback-event]').length,0);
  });
  check('不可见舞台暂停，可见后继续', () => {
    const host=$('#selection-root');const before=win.WuwaPage.selection.getState().progress;
    const observer=visibilityCallbacks.find(o=>o.targets.has(host));
    observer.callback([{target:host,isIntersecting:false,intersectionRatio:0}]);frame(90);
    assert.equal(win.WuwaPage.selection.getState().progress,before);
    observer.callback([{target:host,isIntersecting:true,intersectionRatio:1}]);frame(90);
    assert.ok(win.WuwaPage.selection.getState().progress>before);
  });
  check('统一暂停/继续同步所有舞台', () => {
    $('#motion-toggle').click();assert.equal(win.CaseMotion.getState().paused,true);
    const before=win.WuwaPage.selection.getState().progress;frame(90);assert.equal(win.WuwaPage.selection.getState().progress,before);
    assert.ok($('#motion-toggle').textContent.includes('继续'));
    $('#motion-toggle').click();assert.equal(win.CaseMotion.getState().paused,false);
  });
  win.CaseMotion.setPaused(true);
  check('03推荐优先、品质/位置辅助与旧卡下沉', () => {
    const selection=win.WuwaPage.selection;
    for (const [progress,index] of [[.15,2],[.4,0],[.65,2],[.9,0]]) {
      selection.setProgress(progress);assert.equal(selection.getState().selected,index);
      assert.equal($('#selection-root [data-selection-row="current"]').querySelectorAll('.selection-card').length,3);
    }
    selection.setProgress(.22);assert.equal(selection.getState().moving,true);
    assert.ok(Number($('#selection-root [data-selection-row="next"]').getAttribute('opacity'))>0);
    selection.setProgress(.15);
    assert.equal(selection.getState().winnerReason,'recommendation');
    const cards=$$('#selection-root [data-selection-row="current"] .selection-card');
    assert.equal(cards[0].dataset.rarity,'badge');assert.equal(cards[2].dataset.rarity,'badge');
    assert.equal(cards[0].dataset.recommended,'false');assert.equal(cards[2].dataset.recommended,'true');
    assert.equal(cards[2].dataset.selected,'true');assert.equal(cards[0].dataset.selected,'false');
    assert.ok(cards[2].querySelector('.selection-thumb path'));
    assert.ok($('#selection-root').textContent.includes('本人补充'));
    assert.ok($('.build-result').textContent.includes('电挚'));
  });
  check('04切换案例重回准备并保持自动循环策略', () => {
    win.WuwaPage.rhythm.setProgress(76);$('button[data-rhythm-case="gear"]').click();
    assert.equal(win.WuwaPage.rhythm.getState().progress,0);
    assert.equal($('#rhythm-root').dataset.rhythmCase,'gear');
    win.WuwaPage.rhythm.setProgress(76);
    assert.ok($('[data-rhythm-stage-description]').textContent.includes('继续强化'));
  });
  check('条件依赖曲线在状态外精确回到基线', () => {
    const api=win.WuwaPage.rhythm;
    const low=()=>Number($('[data-rhythm-dot="after"]').getAttribute('cy'));
    api.setCase('wither');api.setProgress(0);const baseline=low();
    api.setProgress(31);assert.equal(low(),baseline);api.setProgress(59);assert.equal(low(),baseline);
    api.setCase('gear');api.setProgress(31);assert.equal(low(),baseline);
    api.setProgress(76);assert.ok(low()<baseline);
    assert.equal(Number($('[data-rhythm-dot="before"]').getAttribute('cy')),baseline);
  });
  check('05两组姿态/特效分段变化，不冒充实机规则', () => {
    const api=win.WuwaPage.feedback;
    api.setProgress(.05);const initial=$('#feedback-scenes-root').innerHTML;
    api.setProgress(.6);assert.notEqual($('#feedback-scenes-root').innerHTML,initial);
    assert.equal($$('#feedback-scenes-root .feedback-scene-screen svg').length,2);
    assert.ok($('#feedback-scenes-root').textContent.includes('不是游戏施法规则'));
    assert.ok($('#feedback-scenes-root').textContent.includes('不代表居合必定触发'));
    assert.ok(!/NaN|Infinity/u.test($('#feedback-scenes-root').innerHTML));
  });
  check('居合与拳击同栏对照，状态另成一栏且标题层级一致', () => {
    const pair=$('.feedback-action-pair');
    assert.equal($('#iaido-scene-root').parentElement,pair);
    assert.equal($('#boxing-scene-root').parentElement,pair);
    assert.ok(!pair.contains($('#state-scene-root')));
    assert.equal(pair.closest('section').getAttribute('aria-labelledby'),'action-feedback-title');
    assert.equal($('.feedback-state-group').getAttribute('aria-labelledby'),'state-feedback-title');
    assert.equal($$('.feedback-action-pair header h4').length,2);
  });
  check('状态双图并列，HUD图保留HP上下位置且无需新增时钟', () => {
    const pair=$('.feedback-state-layout');
    assert.equal(pair.children.length,2);
    assert.equal($('#state-scene-root').parentElement,pair);
    assert.equal($('.feedback-scene-hud').closest('.feedback-hud-column').parentElement,pair);
    assert.equal($('#status-hud-image').getAttribute('src'),'./status-hud.svg');
    assert.ok($('.feedback-hud-rule').textContent.includes('狂欢·浸染'));
    const source=fs.readFileSync(path.join(dist,'status-hud.svg'),'utf8');
    const svg=new JSDOM(source,{contentType:'image/svg+xml'}).window.document;
    assert.equal(svg.documentElement.getAttribute('viewBox'),'0 0 720 390');
    assert.equal($('#state-scene-root svg').getAttribute('viewBox'),svg.documentElement.getAttribute('viewBox'));
    assert.ok(!svg.querySelector('script,animate,animateTransform,foreignObject,image'));
    assert.equal(svg.querySelectorAll('#hud-player-buffs use').length,8);
    assert.equal(svg.querySelectorAll('#hud-target-debuffs use').length,2);
    const playerHealth=Number(svg.querySelector('#hud-player-health rect').getAttribute('y'));
    const playerBuffs=Number(svg.querySelector('#hud-player-buffs g').getAttribute('transform').match(/\d+\s+(\d+)/u)[1]);
    const enemyHealth=Number(svg.querySelector('#hud-target-health rect').getAttribute('y'));
    const enemyDebuffs=Number(svg.querySelector('#hud-target-debuffs rect').getAttribute('y'));
    assert.ok(playerBuffs<playerHealth);assert.ok(enemyDebuffs>enemyHealth);
    svg.querySelectorAll('use').forEach(use=>assert.ok(svg.getElementById(use.getAttribute('href').slice(1))));
    assert.ok(source.includes('数量仅为结构示意'));
    svg.querySelectorAll('[href],[src]').forEach(element=>assert.ok((element.getAttribute('href')||element.getAttribute('src')).startsWith('#')));
    assert.ok(!/file:|\/Users\/|url\(\s*['"]?https?:/u.test(source));
    ['[INPUT]','[OUTPUT]','[POS]','[PROTOCOL]'].forEach(field=>assert.ok(source.includes(field)));
    assert.ok(source.split('\n').length<=800);
  });
  check('新增拳击普通接触有微量确认，蓄力重击没有同类提示', () => {
    const boxing=win.WuwaPage.boxing;
    const initial=boxing.getState();
    for(const time of initial.normalContacts) {
      boxing.setProgress(time/initial.duration);const state=boxing.getState();
      assert.equal(state.activeAttack.kind,'normal');assert.equal(state.cueActive,true);
      assert.equal(state.calloutActive,true);
      assert.ok(state.contactError<.00001);
    }
    boxing.setProgress(initial.heavyContact/initial.duration);const heavy=boxing.getState();
    assert.equal(heavy.activeAttack.kind,'heavy');assert.equal(heavy.cueActive,false);
    assert.equal(heavy.calloutActive,false);
    assert.ok(heavy.contactError<.00001);
    for(let time=initial.heavyContact;time<=initial.duration;time+=.05) {
      boxing.setProgress(time/initial.duration);assert.equal(boxing.getState().cueActive,false);
      assert.equal(boxing.getState().calloutActive,false);
    }
    assert.ok(!/NaN|Infinity/u.test($('#boxing-scene-root').innerHTML));
  });
  check('普通攻击采用同款方框引线，蓄力时撤去且无普通拳用词', () => {
    const boxing=win.WuwaPage.boxing;
    boxing.setProgress(2/14);
    const callout=$('.boxing-confirm-callout');
    assert.ok(callout.querySelector('.feedback-confirm-ticks'));
    assert.ok(callout.querySelector('.feedback-stage-label').textContent.includes('普通攻击'));
    assert.equal(boxing.getState().cueActive,false);
    assert.equal(boxing.getState().calloutActive,true);
    boxing.setProgress(7/14);
    assert.equal(boxing.getState().calloutActive,false);
    assert.equal(Number(callout.getAttribute('opacity')),0);
    assert.ok(!/普通拳/u.test($('#boxing-scene-root').textContent));
  });
  check('低动态代表接触帧仍可辨，重拳无普通确认', () => {
    const lowDom=new JSDOM('<div id="boxing"></div>',{runScripts:'outside-only'});
    const low=lowDom.window;
    low.CaseMotion={getState:()=>({reducedMotion:true}),mount(host,options){
      options.render(0,0);
      return {setProgress(p){options.render(p,p*options.duration);},getState:()=>({reducedMotion:true}),destroy(){}};
    }};
    low.eval(fs.readFileSync(path.join(dist,'boxing-scene.js'),'utf8'));
    const api=low.WuwaBoxingScene.mount(low.document.getElementById('boxing'));
    for(let time=0;time<6;time++) {
      api.setProgress(time/14);const state=api.getState();
      assert.equal(state.reducedMotion,true);assert.equal(state.cueActive,true);assert.ok(state.contactError<.00001);
    }
    for(let time=6;time<14;time++){api.setProgress(time/14);assert.equal(api.getState().cueActive,false);}
    api.destroy();low.close();
  });
  check('删除自明播放标签，保留中性策略与有效性说明', () => {
    assert.ok(!/自动演示|示意候选|自动循环 · 选择前后同步推进/u.test($('#main').textContent));
    assert.ok($('.selection-demo-label').textContent.includes('轻阅读策略'));
    assert.ok($('.boxing-boundary').textContent.includes('触发间隔'));
  });
  check('卡面字体本地可分发且字阶由独立角色层管理', () => {
    const font=fs.readFileSync(path.join(dist,'fonts/case-relic.woff2'));
    const provenance=JSON.parse(fs.readFileSync(path.join(dist,'fonts/provenance.json'),'utf8'));
    assert.equal(font.subarray(0,4).toString(),'wOF2');assert.equal(hash(font),provenance.sha256);
    assert.ok(fs.readFileSync(path.join(dist,'fonts/OFL.txt'),'utf8').includes('SIL OPEN FONT LICENSE'));
    assert.ok(provenance.glyphText.includes('徽记强化'));
    const sheet=fs.readFileSync(path.join(dist,'type-system.css'),'utf8');
    for(const role of ['--type-body','--type-subtitle','--type-overline','--type-caption'])assert.ok(sheet.includes(role));
    assert.equal($$('link[rel="stylesheet"]').at(-1).getAttribute('href'),'./type-system.css');
  });
  check('主文与金色文字的基础色对比达到普通文字阈值', () => {
    const luminance=hex=>{
      const values=hex.match(/[0-9a-f]{2}/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
      return values[0]*.2126+values[1]*.7152+values[2]*.0722;
    };
    for(const [fg,bg] of [['d9b77d','090c0f'],['a7a39a','121518'],['f5f0e7','090c0f']]) {
      const values=[luminance(fg),luminance(bg)].sort((a,b)=>b-a);
      assert.ok((values[0]+.05)/(values[1]+.05)>=4.5);
    }
  });
  win.CaseMotion.setPaused(false);
  frame();
  for(let i=0;i<410;i++)frame(50);
  check('03与04自动跨过完整周期后继续播放', () => {
    assert.ok(win.WuwaPage.selection.getState().motion.cycle>=1);
    assert.ok(win.WuwaPage.rhythm.getState().cycle>=1);
    assert.equal(win.WuwaPage.rhythm.getState().playing,true);
  });
  win.CaseMotion.setPaused(true);
  check('原图与记录对话框装配完整且关闭返回控件', () => {
    $('[data-open-figure="figure-06"]').click();assert.equal($('#figure-dialog').open,true);assert.ok($('#figure-dialog-image').src.includes('06-metaphor-rhythm'));
    $('#figure-dialog [data-close-dialog]').click();assert.equal($('#figure-dialog').open,false);
    $('[data-open-record="R03"]').click();assert.ok($('#document-dialog-body').textContent.includes('永久解梦不是无限免死'));
    $('#document-dialog [data-close-dialog]').click();
    $('[data-open-document="audit"]').click();assert.ok($('#document-dialog-body').textContent.includes('霜灭'));
    $('#document-dialog [data-close-dialog]').click();
  });
  check('结束索引与图库移除，页尾只保留原仓库入口', () => {
    assert.equal($('#archive'),null);assert.equal($('#figure-gallery'),null);assert.equal($('#toggle-all'),null);
    assert.equal($('.site-footer').children.length,1);
    assert.equal($('.site-footer a').href,'https://github.com/Meracle-sjj/wuwa-roguelike-system-analysis');
    assert.equal($$('[href^="#full-"]').length,0);
  });
  const manifest = JSON.parse(fs.readFileSync(path.join(dist,'sources/source-manifest.json'),'utf8'));
  check('34份来源原件与八图保持固定提交SHA-256', () => {
    assert.equal(manifest.files.length,34);
    for (const file of manifest.files) {
      assert.equal(hash(fs.readFileSync(path.join(dist,'sources',file.local))),file.sha256);
      const upstream=execFileSync('git',['show',`${manifest.commit}:${file.source}`],{cwd:root,maxBuffer:64*1024*1024});
      assert.equal(hash(upstream),file.sha256);
      if (file.source.endsWith('.png')) assert.equal(hash(fs.readFileSync(path.join(dist,file.source))),file.sha256);
    }
  });
  check('可维护源码不超过800行并具备文件契约', () => {
    for (const name of fs.readdirSync(dist).filter(name=>/\.(html|css|js)$/u.test(name))) {
      const source=fs.readFileSync(path.join(dist,name),'utf8');assert.ok(source.split('\n').length<=800);
      for(const field of ['[INPUT]','[OUTPUT]','[POS]','[PROTOCOL]'])assert.ok(source.slice(0,1000).includes(field),`${name} 缺少 ${field}`);
    }
  });
  check('反馈销毁不清除拳击兄弟，全部销毁后时钟无残留', () => {
    const instances=win.CaseMotion.getState().instances;
    win.WuwaPage.feedback.destroy();
    assert.equal(win.CaseMotion.getState().instances,instances-2);
    assert.equal($('#iaido-scene-root').innerHTML,'');assert.equal($('#state-scene-root').innerHTML,'');
    assert.ok($('#boxing-scene-root svg'));
    Object.entries(win.WuwaPage).filter(([name])=>name!=='feedback').forEach(([,api])=>api.destroy());
    assert.equal(win.CaseMotion.getState().instances,0);
  });
  const report={revision:'HTML v3 focused arguments, subjective axes and simplified repository ending',generatedAt:new Date().toISOString(),sourceCommit:manifest.commit,passed:true,checks,
    limitations:['jsdom不做排版、SVG视觉或键盘原生行为判断；这些另经真实浏览器检查。','曲线是定性规则解释，反馈是概念提案，均不代表游戏实测或实装。']};
  fs.writeFileSync(path.join(root,'preview/verification.json'),JSON.stringify(report,null,2)+'\n');
  win.close();
  process.stdout.write(`${checks.length} checks passed; preview/verification.json\n`);
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
