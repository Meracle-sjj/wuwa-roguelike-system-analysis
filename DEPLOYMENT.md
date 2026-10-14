<!--
[INPUT]: dist 离线包、GitHub Pages 工作流和固定公开来源提交。
[OUTPUT]: 简历作品链接、持续发布操作和可用性验证边界。
[POS]: 仓库发布说明；区分工作流配置、实际上线和大陆网络测量。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 作品发布

固定访问入口：[千道门扉的异想 · 交互拆解](https://meracle-sjj.github.io/wuwa-roguelike-system-analysis/)。无需登录；资源均来自同一个站点，相对路径同时支持离线目录与 Pages 项目路径。

2026-10-14 首次部署成功，发布提交 `6b0f5581df6e81e356cebd8739712a47c23401b9`；[Actions 运行记录](https://github.com/Meracle-sjj/wuwa-roguelike-system-analysis/actions/runs/38512324717)。HTTPS 强制开启，本机直连首页返回 HTTP 200，约0.38秒，HTML 字节与本地一致。线上资源逐文件核验另见 `preview/publication-verification.json`；这些结果不等于中国大陆全部网络持续可用。

GitHub 仓库仍保存研究原稿及公开来源。Pages 只发布 `dist/`，不发布本机学习课件、录音、工具依赖或 Git 元数据。字体及 OFL 版权文件随网页分发。

## 更新

1. Node 24 以上运行 `npm ci --ignore-scripts`。
2. 修改页面后运行 `npm run verify`，维护 L3 和对应 CLAUDE 地图。
3. 提交并推送到 `main`。`.github/workflows/pages.yml` 校验通过后自动更新同一个网址，也可以手动运行工作流。

核验使用完整 Git 历史，逐字节核对固定提交 `fb160b19e5d5e19b306c9e3e8ea1f67ffd3458f2` 的34份原件。部署不重新构建原文；若确实需要刷新内容，按 dist/README.md 修改固定来源并运行 `npm run build:content`。

发布过程遵循 [GitHub 官方 Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。公开 Actions 运行记录提供实际成功/失败状态；目标网址的 HTTP 响应和浏览器加载需另行验证。

## 国内访问

GitHub Pages 的固定链接与中国大陆所有运营商持续可达是两件事。[GitHub 服务条款第 O 节](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#o-disclaimer-of-warranties)不保证服务在特定时间或地点可用。上线后应以大陆节点测试 HTTP 状态，再用实际浏览器核对页面资源；某一时刻的测试结果不构成全国、长期可用性保证。

本次线上浏览器工具连接超时，未取得大陆多节点结果；本机 HTTP 请求关闭了环境代理，但没有据此推断出口地区或系统 VPN 状态。可以用 [ITDOG 网站测速](https://www.itdog.cn/http/)测试完整项目地址，或用关闭代理的手机流量/家庭网络访问。未取得真实网络结果前，国内可用性保持未确认。

简历可以写“千道门扉的异想｜系统拆解与交互演示”，链接到上述项目入口。若后续拥有自定义域名，可保持简历域名不变再迁移托管；域名购买与大陆托管需另行选择，本次发布不产生这些费用。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
