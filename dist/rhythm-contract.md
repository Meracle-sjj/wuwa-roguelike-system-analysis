<!--
[INPUT]: rhythm.js、rhythm.css、CaseMotion及正文第四章的规则与体验边界。
[OUTPUT]: 提供组件接入、对照语义和可复核状态，不要求专用浏览器或游戏运行环境。
[POS]: dist 的节奏交互契约；index/app 消费接口，源记录提供事实依据。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 隐喻节奏组件

本组件复述《系统拆解案》v0.14第四章的两个已记录案例；曲线是定性设计示意，不计算秒数、DPS、情绪得分或道具性价比。没有任意混搭或反事实装配。

## 接入

在页面中放置容器、普通 CSS 和经典脚本，再在 app.js 或 DOM 就绪后调用：

```html
<link rel="stylesheet" href="rhythm.css">
<div id="rhythm-root"></div>
<script src="rhythm.js"></script>
```

```js
const rhythm = window.WuwaRhythm.mount(document.getElementById('rhythm-root'));
```

先加载motion.js的CaseMotion，再加载组件。普通脚本可本地file打开，没有模块、fetch、CDN、存储、声音或游戏逻辑。所有组件选择器以rhythm-命名，共享主题色，曲线由原生SVG绘制。

## 控制接口

| 接口 | 作用 |
| --- | --- |
| `setCase('wither')` | R05飓风取得凋零的梦；重回准备并按可见性自动循环 |
| `setCase('gear')` | R03狂欢取得齿轮之心；重回准备并按可见性自动循环 |
| `setProgress(value)` | 改变内部0—100的无单位示意进程；越界截断，非数值不生效 |
| `getState()` | 返回caseId/progress/phase/playing/cycle/reducedMotion，用于检查和接入 |
| `destroy()` | 停止计时、移除事件及组件DOM；可重复调用 |

同一容器再次mount先清理旧实例。案例切换从准备重新开始；组件由CaseMotion驱动16秒循环，起点与终点短停。图表进入视野自动播放，离屏和页面隐藏暂停，返回继续。全页导航提供统一暂停供停帧阅读。setProgress仅用于维护，不提供访客拖动界面。

## 控件与检查

- `[data-rhythm-case="wither"/"gear"]`：原生案例按钮，aria-pressed同步选择。
- `[data-rhythm-playhead]`：自动进程条，无拖动或启动门槛。
- `[data-rhythm-phase-item]`：准备/入梦/基础窗口后的被动阶段标记。
- `[data-rhythm-stage]`和`[data-rhythm-stage-description]`：用文字等价说明当前机制，不要求从曲线读出规则。
- `[data-rhythm-band="before"/"after"]`：SVG状态带；gear后状态带延伸到示意末端，wither为有限窗口。
- `[data-rhythm-marker="before"/"after"]`：同位置进程标线。
- 容器data-rhythm-case/progress/phase/playing：可读状态；phase 0/1/2为准备/入梦/基础窗口后。

SVG有title/desc，图例同时用颜色和线型；曲线旁有说明。案例按钮有可见焦点，手机双图纵排；低动态偏好由共享时钟粗采样，CSS关闭装饰动画。记录链接使用dist/sources/records/中的修正稿，复制时需同时保留。

## 必须保留的解释边界

R05中凋零只限制徽记触发，不能说常态角色攻击或声骸整体失效。“额外2次”不能换算最终DPS三倍，额外触发与其它核心的具体叠加没有在本案实测。

R03中齿轮是初次入梦后永久，不能绘成从开局自动解梦；−30%仅是原规则标签，曲线高低和面积不体现实际最终伤害。永久解梦不能推成永久免死。动力锤的选择理由属于玩家当时判断，具体时长交互未验证。R06因回能充足拒绝齿轮是另一局的独立理由。

两组前后均用相同进程和定性纵轴。后半段是原有限窗口的退出位置，不声称实际战斗到此结束，也不捏造永久解梦结束节点。
