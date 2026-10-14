<!--
[INPUT]: 六章原文、来源快照、四个观点舞台与CaseMotion的自动播放契约。
[OUTPUT]: 独立复制与阅读HTML的说明，以及后续Agent维护与问答的通用入口。
[POS]: dist的交付契约；说明网页改编，来源规则和个人体验由sources原件承担。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 黑金动态拆解 v3 · 千道门扉的异想

双击 [index.html](index.html) 即可离线打开。复制或分享时保留整个 `dist/` 文件夹：HTML、样式、脚本、八图和原件包全部使用相对路径，不需要登录、安装依赖或启动服务。浏览器需允许 JavaScript；原稿也可单独用文本编辑器阅读。

在线发布入口：[千道门扉的异想 · 交互拆解](https://meracle-sjj.github.io/wuwa-roguelike-system-analysis/)。持续发布和大陆可用性边界见仓库根目录 `DEPLOYMENT.md`；在线地址不替代原文来源标记。

页面本身承担六段论证：基础循环、能力来源、成型路径、节奏改写、反馈提案、落地与证据。观点、具体因果和取舍直接呈现在架构与动画中，阅读主页面即可理解案例。末尾“原作全案”保留完整正文和附件，供深入核对；八图可放大，R03—R06 可查看完整修正稿。

## 交互如何读

- **02 能力来源**：四组来源经13个具体机制连接12徽记，重击与护盾共同指向一个坚盾。金色/青玉标记基础主收益的解梦依赖，另有相同峰值/窗口的基础节奏对照；手机仍保留层级与箭头。
- **03 连续选择**：先参考大拇指推荐，带推荐的徽记强化优先于同档无推荐金卡；无推荐时再比较品质，同档最左。旧三框沉到下沿，新三框成为中心。右上为中性的轻阅读策略标签，卡面采用独立字体。R04统计与作者补充分别见[修订记录](revision-notes.md)，不当作19次完整重放。
- **04 隐喻节奏**：进入视野即循环播放选择前后的同步进程，切换案例重新从准备开始；没有启动、拖动或阶段跳转门槛。资源与风险判断随案例一并呈现。
- **05 反馈提案**：居合与拳击放在同一个动作对照栏，比较关键动作的聚焦确认和高频动作的克制确认；两者都以四角框和引线指明确认位置。普通攻击接触沙袋时给短小提示，蓄力重击不发同类确认并撤去标注；低动态模式用接触关键帧维持辨识。祈祷与敌我状态单独成栏。姿态是方案说明，真实生效及触发间隔仍须核对，不推断每段命中必定触发。
- **观看与阅读**：舞台可见时自动播放，离屏或页面隐藏时暂停；导航有统一暂停/继续按钮供停帧阅读。低动态偏好采用较粗帧采样。原文可逐章或全部展开，原图及资料对话框可用 Escape 关闭。

曲线横轴没有实际秒数，纵轴没有伤害或情绪分数。额外触发2次不等于最终伤害三倍，永久解梦不等于永久免死；两案例不做伤害/通关速度排名。详细模型契约在 [rhythm-contract.md](rhythm-contract.md)。

## 让任何 Agent 阅读

先读 [sources/SNAPSHOT.md](sources/SNAPSHOT.md)，再读 [sources/系统拆解案.md](sources/系统拆解案.md)。具体问题分别核对 [来源与方法](sources/来源与方法.md)、[徽记触发核验](sources/徽记触发核验.md)和 [records/README.md](sources/records/README.md)。全文是普通 UTF-8 Markdown，记录是 Markdown/TXT，清单是 JSON，不依赖网页、专用字体或此前对话。

原文版本 v0.14，2026-10-07；来源固定提交 `fb160b19e5d5e19b306c9e3e8ea1f67ffd3458f2`。网页v3整理于2026-10-14，补充推荐优先、高频反馈与发布排版，见revision-notes.md；两个版本分别标记。34份公开原件有逐文件SHA-256；八张PNG保持原样。主页面论述、来源树、SVG曲线及动画是改编，应与规则、个人体验及尚未实装的提案区分。图像提示词与作者/AI分工说明在sources/imagegen/；没有录音文件，尚无完整实机音画记录。

## 维护

页面布局在index.html，色彩和几何在theme/style/reading/responsive；最后加载type-system.css统一阅读字阶，规则与官方参照见typography-guide.md。fonts/是本地卡面字集及OFL，新增用字要核对覆盖。hierarchy、selection、rhythm、feedback-scenes和boxing-scene维护各自局部DOM，motion.js统一管理循环，app.js负责装配。正文从content-data.js加载。组件contract保留语义边界，代码更新后检查本地图；原文问答优先回sources，新增观点同时核对revision-notes。

只改网页不需要重建正文。来源提交改变时，核对 `../tools/build-content.mjs` 的固定提交、元数据与摘要，再运行 `node tools/build-content.mjs`。构建依赖 marked，可用 `WUWA_MARKED_PATH` 指向其ES模块；已有 dist 阅读不依赖该库。

从仓库根目录运行 `npm ci --ignore-scripts` 和 `npm run verify`，需要 Node 24 以上。也可以保留 `WUWA_JSDOM_PATH` 指定既有 jsdom 安装目录。报告在 `../preview/verification.json`；jsdom核验不代替真实浏览器排版，浏览器截图与检查范围另见 `../preview/README.md`。工作流使用相同核验，通过后只上传本目录。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
