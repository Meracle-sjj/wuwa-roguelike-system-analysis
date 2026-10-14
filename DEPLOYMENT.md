<!--
[INPUT]: dist 离线包、GitHub Pages 工作流和固定公开来源提交。
[OUTPUT]: 简历作品链接、持续发布操作和可用性验证边界。
[POS]: 仓库发布说明；区分工作流配置、实际上线和大陆网络测量。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 作品发布

目标访问入口：[千道门扉的异想 · 交互拆解](https://meracle-sjj.github.io/wuwa-roguelike-system-analysis/)。无需登录；资源均来自同一个站点，相对路径同时支持离线目录与 Pages 项目路径。

GitHub 仓库仍保存研究原稿及公开来源。Pages 只发布 `dist/`，不发布本机学习课件、录音、工具依赖或 Git 元数据。字体及 OFL 版权文件随网页分发。

## 更新

1. Node 24 以上运行 `npm ci --ignore-scripts`。
2. 修改页面后运行 `npm run verify`，维护 L3 和对应 CLAUDE 地图。
3. 提交并推送到 `main`。`.github/workflows/pages.yml` 校验通过后自动更新同一个网址，也可以手动运行工作流。

核验使用完整 Git 历史，逐字节核对固定提交 `fb160b19e5d5e19b306c9e3e8ea1f67ffd3458f2` 的34份原件。部署不重新构建原文；若确实需要刷新内容，按 dist/README.md 修改固定来源并运行 `npm run build:content`。

发布过程遵循 [GitHub 官方 Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。公开 Actions 运行记录提供实际成功/失败状态；目标网址的 HTTP 响应和浏览器加载需另行验证。

## 国内访问

GitHub Pages 的固定链接与中国大陆所有运营商持续可达是两件事。上线后应以大陆节点测试 HTTP 状态，再用实际浏览器核对页面资源；某一时刻的测试结果不构成全国、长期可用性保证。免费境外托管没有在本项目中建立大陆网络服务等级承诺。

简历可以写“千道门扉的异想｜系统拆解与交互演示”，链接到上述项目入口。若后续拥有自定义域名，可保持简历域名不变再迁移托管；域名购买与大陆托管需另行选择，本次发布不产生这些费用。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
