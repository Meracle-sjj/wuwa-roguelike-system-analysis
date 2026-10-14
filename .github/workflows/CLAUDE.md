# workflows/
> L2 | 父级: ../CLAUDE.md

成员清单
pages.yml: main 推送或手动触发；完整 Git 历史、Node 24 和锁定 npm 依赖运行核验，成功后上传 dist 并部署 Pages。

权限边界：校验阶段只有仓库读取权限；部署阶段增加 Pages 写入和 OIDC，仅发布已验证的静态包，不写回源码或使用个人凭证。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
