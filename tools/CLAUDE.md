# tools/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单

build-content.mjs: npm marked或环境指定模块将固定Git原文→安全HTML和离线快照；不把网页改编回写原文，无本机硬编码路径。
verify-page.cjs: file URL执行网页，28项核验关键文案/纵轴、六章原文无删节及单链接结尾、双图/HUD、拓扑/循环和来源字节；需要jsdom，输出preview/verification.json。

数据流：固定提交原件 → 安全Markdown渲染 → dist/content-data.js；原件字节另行复制到dist/sources，以哈希清单核对。PNG在dist/assets和原件包各保留一份，以支持页面与资料包独立读取。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
