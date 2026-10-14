<!--
[INPUT]: 本地核验/截图、Pages资源哈希与用户无代理访问反馈。
[OUTPUT]: 说明验证范围和未测内容，不替代原研究的来源与方法。
[POS]: preview的制作证据说明；与dist/sources的研究证据分开。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 网页制作验证

2026-10-14，公开研究固定提交 `fb160b19e5d5e19b306c9e3e8ea1f67ffd3458f2`。

`verification.json` 最新为v3的25项检查，覆盖file URL装配、完整原文/八图/四局数据、本地引用、来源拓扑、播放生命周期、推荐优先与旧卡下沉、隐喻条件与循环、旧反馈姿态、普通攻击/重击的精确接触与确认差异、低动态代表帧、本地字体/OFL/哈希、字阶入口、三组主要文字色对比及来源字节。本次增加动作同栏/状态独立、确认框线/普通攻击文案及分宿主销毁隔离检查。jsdom不判断真实版式；基本色对比通过不等于整页WCAG认证。

v3浏览器核对1280px、390px及320px：设计起点20px、正文约18px、英文章眉约14px；手机正文16px、组标题18px。Case Relic已本地加载，右金徽记强化带推荐而被选，左同档金卡未选。普通攻击局部微光已观看，重击不发同类确认由接触关键帧核验覆盖；旧两舞台未改姿态。最窄屏幕无横向溢出，来源分组与坚盾双来源保留。

本次反馈版式复验：1280px 居合/拳击在同框并排，两舞台顶部一致、高度约291px；完整刀圈与拳击方框/引线同时可见。390px 与320px 在同框上下排列，无横向溢出；320px 的“普通攻击确认”文字右缘约278px，位于视口内。状态舞台独立成栏；销毁居合/状态组件保留拳击兄弟，全部销毁后共享时钟实例归零。

最新动作截图：v3-action-comparison、v3-action-mobile；v3-typography、v3-selection与v3-mobile仍记录本轮字阶和推荐设计，v3-boxing为本次同栏调整前留档。v1/v2截图均为历史留档，不能推断当前仍有旧控件或旧字号。所有截图都是网页制作证据，微光截图只是短闪光中的一个时刻。未验证游戏数值、游戏性能、方案实装、真实玩家满意度或整页可访问性认证。

维护复验：`WUWA_JSDOM_PATH=/path/to/jsdom node tools/verify-page.cjs`。报告只在核验全部通过时写出；浏览器截图与结论需要另行检查，不能靠重新生成报告自动更新。

Pages首发：[Actions成功记录](https://github.com/Meracle-sjj/wuwa-roguelike-system-analysis/actions/runs/38512324717)，发布提交 `6b0f5581df6e81e356cebd8739712a47c23401b9`。[线上入口](https://meracle-sjj.github.io/wuwa-roguelike-system-analysis/)强制HTTPS，首页本机HTTP200且字节与本地一致。`publication-verification.json`保存全包HTTP/哈希结果及测量时间。此次线上浏览器工具连接超时，未重新做线上视觉验证，也未取得大陆多节点测速；上文浏览器截图仍是本地制作验证，不能当作国内可用性证据。

2026-10-14 用户对无代理访问问题回复“可以直接打开”，补充当前用户真实网络访问成功的证据。它是用户报告，不是Agent运行的多节点或资源测量；未提供网络类型、运营商、地点或具体加载耗时。`publication-verification.json` 的 `userNetworkCheck` 单独保留该反馈，原有逐文件检查时间与部署提交不变。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
