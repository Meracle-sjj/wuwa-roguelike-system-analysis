<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 两类基础反馈节奏

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：图2 初次生成

```text
Use case: infographic-diagram. Asset type: high-end static figure for a Chinese game SYSTEM DESIGN portfolio report about Wuthering Waves. Produce an impeccably art-directed BLACK AND GOLD information graphic, not a webpage, not a wireframe, not a screenshot of code, not boxes of prose. The whole image must look like a premium AAA game design presentation: warm near-black matte background, restrained brushed champagne-gold lines and accents, crisp ivory typography, elegant spacing, strong visual hierarchy. No game characters, no scenery, no logos, no ornate decorative clutter. Chinese type must visually match Microsoft YaHei (微软雅黑); English and numerals must visually match Georgia. Chinese labels must be rendered EXACTLY as supplied, clearly legible at normal report size. Use large type, very few words, no explanatory paragraphs, no invented numbers. Keep comfortable outer margins. Deliver one finished high-resolution raster image, approximately 4:3 landscape. Do not add watermark, code, UI chrome, or additional text.
Primary request: Figure 2 is ONE large overlaid LINE CHART, not panels of text and not a table. Title exactly "两类基础反馈节奏". Y-axis label exactly "体验强度（示意）"; x-axis label "战斗进程". No numerical scales.
Plot two clearly distinct smooth ECG-inspired qualitative traces: gold SOLID line for a sigil that has low-to-medium regular feedback before the dream state and rises to a strong peak during it; ivory DASHED line for a sigil whose main reward is quiet before the dream state and rises to THE EXACT SAME PEAK at THE EXACT SAME TIME. Both return to their respective baselines afterwards. Show two repeated cycles across the time axis. Dream windows are indicated by TWO very faint translucent gold vertical bands, each labeled "解梦". Peaks must coincide in position and height; use dashed vs solid styling so overlapping peaks remain understandable. This is design rhythm, not a literal medical ECG.
Below the chart, only two concise legends:
gold line: "常态可用，入梦增强" and smaller "热焰 · 飓风 · 雷暴 · 冰绽"
ivory dashed line: "主要收益仅在解梦" and smaller "狂欢 · 心流 · 时驭 · 剥蚀 · 坚盾 · 谐度 · 霜灭 · 瞬燃"
Small footer exactly "主收益概念模型 · 非实测". All names must be accurate. Do not write item effects, tooltips, boxes of text, more than these two legend lines, or numeric emotional scores.
```

## 步骤2：图2 定向修正

```text
Edit this supplied two-line chart. Keep the layout, black/gold palette, the two dream bands, exact title and all legend names. Correct the ivory DASHED line outside dream windows so it lies at the ZERO/silent baseline, without little bumps or ongoing feedback. The gold SOLID line keeps lower regular activity outside windows. Within each dream band BOTH traces must reach the exact SAME peak x-coordinate AND exact SAME height; make the ivory dashed trace share the gold peak, using dash styling for visibility. Do not introduce numbered values or additional descriptions.
MANDATORY typography correction: replace EVERY Chinese serif/calligraphic label with clean modern NON-SERIF Microsoft YaHei (微软雅黑)-style lettering. This especially includes the title "两类基础反馈节奏", the big legend titles and axis labels. No Song/Ming/Simsun/Kai, no brush endings, no serifs. Chinese title bold sans-serif, other Chinese medium/regular sans-serif; English/numerals Georgia if present. Preserve the two short legends and footer, no extra paragraphs.
```

## 2026-10-07核验后的范围修正

分类对象为基础主效果，隐喻可改写；时驭退出结算用解梦循环表达。

```text
Edit this supplied "两类基础反馈节奏" black/gold chart. Only clarify its classification scope and the second legend label; preserve all curve shapes, two dream bands, title, axes, gold/ivory line styles, positions and all twelve sigil names.
Replace "主要收益仅在解梦" with EXACTLY "主收益依赖解梦循环". Keep the first legend "常态可用，入梦增强" unchanged.
Replace the small footer "主收益概念模型 · 非实测" with EXACTLY "基础主收益节奏示意 · 隐喻可改写 · 非实测".
Do not say all effects stop outside 解梦. 解梦循环 includes entering, being in, and exiting the state; 时驭's damage settles at exit. This remains a qualitative rhythm model, not an exact per-sigil timing graph. Do not add these explanatory paragraphs to the chart.
Preserve NON-SERIF Microsoft YaHei-style Chinese typography, Georgia-style numerals, the premium black/gold palette, all layout and curve geometry. No extra chart, no altered peak height or damage statistic.
```

[最终图像](../assets/04-baseline-rhythm.png) · [制作索引](README.md)
