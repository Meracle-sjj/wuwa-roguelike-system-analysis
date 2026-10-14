# .github/
> L2 | 父级: ../CLAUDE.md

成员清单
workflows/: GitHub Actions 发布入口，验证既有静态页面后只上传 dist/。

职责边界：仓库研究原件与网页源码保留在主分支，线上访问根目录来自 dist/index.html；自动发布不重写固定提交的来源快照。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
