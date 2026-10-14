# 千道门扉的异想系统拆解 - 可独立发布的作品目录

Git + GitHub Pages/Actions + Markdown正文 + 原始ASR与修正稿 + 图片模型位图与提示词 + HTML/CSS/JavaScript/SVG + Node.js 24

> L1 | 发布目录宪法与全局地图

远端：https://github.com/Meracle-sjj/wuwa-roguelike-system-analysis
默认分支：main；远端别名：origin。公开发布；原始录音文件不纳入当前树或Git历史，音频格式由.gitignore排除。

## 目录

assets/: 正文八图，仅发布当前消费的PNG，来源与模型记录在imagegen。
imagegen/: 工具/型号可知范围、八图完整提示词与定向修正链，服务制作可追溯性。
records/: R03—R06原始ASR、公开修正稿与六局索引，只有文本，原始录音私有留存。
dist/: 黑金动态拆解v3；关键论点金线/主观纵轴/轻阅读测试目的，动作与状态双图；原文按需对话框、结尾单仓库链接，34份快照与补充分开。
tools/: 固定提交内容构建与file URL交互/字节核验；依赖marked/jsdom仅用于维护，页面阅读不依赖这些包。
preview/: 网页制作截图、验证报告与范围说明，不作为原研究的游戏机制证据。
.github/: Pages持续发布配置，核验与部署权限分离 (1子目录: workflows)。

## 根文件

README.md: 面向作品阅读者的HTML/原文入口、核心问题和阅读顺序。
DEPLOYMENT.md: 固定作品网址、main持续发布步骤和大陆网络验证边界。
package.json: Node 24维护命令与精确版本的jsdom/marked开发依赖，页面运行不依赖npm。
package-lock.json: npm依赖解析锁，供本机与Actions一致核验，不随网页上线。
系统拆解案.md: v0.14完整正文，说明周常与上限、代表案例选择及动作认知/信息负担，图片附件用相对路径。
来源与方法.md: 官方/社区来源及边界，含新回能/延时例子和绯雪技能核对，不冒称实机UI审计。
徽记触发核验.md: 12基础与6核心逐条核验、霜灭常态疑问及基础分类对象，规则文本不冒充实机。
.gitignore: 排除系统缓存、临时文件、本地环境配置、node_modules和音频文件。
CLAUDE.md: 独立发布目录地图，不依赖外部私有路径。

维护：事实、体验、提案分开；颜色仅限基础主收益，解梦循环含进入/期间/退出。正文与图注同步，ASR原样归档；公开历史不含录音文件。新增网页导览、SVG曲线和事件演示是改编，不能写回原件冒充实测。dist完整复制可离线使用；用户授权将其发布到GitHub Pages，main推送需通过核验，线上只消费dist。配置与验证边界见DEPLOYMENT.md，实际部署以Actions成功记录及HTTPS访问为准。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
