<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 隐喻改写体验节奏

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：图4 初次生成

```text
Use case: infographic-diagram. Asset type: high-end static figure for a Chinese game SYSTEM DESIGN portfolio report about Wuthering Waves. Produce an impeccably art-directed BLACK AND GOLD information graphic, not a webpage, not a wireframe, not a screenshot of code, not boxes of prose. The whole image must look like a premium AAA game design presentation: warm near-black matte background, restrained brushed champagne-gold lines and accents, crisp ivory typography, elegant spacing, strong visual hierarchy. No game characters, no scenery, no logos, no ornate decorative clutter. Chinese type must visually match Microsoft YaHei (微软雅黑); English and numerals must visually match Georgia. Chinese labels must be rendered EXACTLY as supplied, clearly legible at normal report size. Use large type, very few words, no explanatory paragraphs, no invented numbers. Keep comfortable outer margins. Deliver one finished high-resolution raster image, approximately 4:3 landscape. Do not add watermark, code, UI chrome, or additional text.
Primary request: Figure 4 explains how metaphors reshape the rhythm with VERY LITTLE text. Title exactly "隐喻如何改写体验节奏". A clean 2-by-2 matrix of four line plots, same axis scale and aligned styling, spacious and polished. Y-axis label "预期体验强度" and x-axis label "战斗进程"; qualitative low/high only, NO numbers. Minimal Georgia panel letters A, B, C, D with Chinese headings.
Panel A heading "常态可用，入梦增强": regular lower activity, then a sharp stronger dream-window peak, then lower regular activity.
Panel B heading "主要收益由解梦开启": near-zero main feedback before the same window, THE SAME peak height as A in the dream window, near-zero afterwards.
Panel C heading "凋零：窗口集中": show a faint dashed baseline of A and a bold gold changed curve; changed curve is quiet outside dream and has a higher peak inside. Small caption only "额外触发 · 仅在解梦".
Panel D heading "齿轮：持续强化": after dream begins, a middle-to-high sustained band with small action-related undulations, not a perfectly flat line and not maximum constant excitement. Small caption only "永久解梦 · 最终伤害−30%".
The dream state uses a very subtle gold tinted time band in A/B/C. In D the band continues to the plot's right edge. Basic curves ivory; modified curves gold; small peaks and rhythms look crisp, refined, ECG-inspired but not a medical signal.
Footer exactly "体验节奏假设 · 非实测". Do not claim emotional measurements, DPS values, build rankings or retention improvements. No paragraphs, no explanation tables, no literal medical icons.
```

## 步骤2：图4 定向修正

```text
Edit the supplied four-plot image. Preserve the black/gold style, all four curves, the dream-window highlights, the 2-by-2 structure, all headings, and the -30% content.
AXIS CORRECTION: remove "低" and "高" labels from the HORIZONTAL time axes in ALL four panels. They do not belong on a time axis. Keep only "战斗进程" along each horizontal axis. Keep "低" and "高" on the VERTICAL experience axes.
TYPOGRAPHY CORRECTION: ALL Chinese text, especially the large title "隐喻如何改写体验节奏" and panel headings, must be clean modern NON-SERIF Microsoft YaHei / 微软雅黑-style typography: uniform contemporary strokes, no Song/Ming/SimSun/Kai, no brushlike endings, no serifs. Chinese title bold sans-serif, body regular sans-serif. Keep English panel letters A B C D in Georgia. Keep the conceptual footer and all Chinese names verbatim. Do not add numeric scores or explanatory paragraphs.
```

## 步骤3：metaphor

```text
Edit the supplied four-plot image. ONLY update panel C and D item names and their short effect captions; preserve all four curves, axes, stage bands, typography, colors and composition.
Panel C heading EXACTLY "凋零的梦：窗口集中".
Panel C caption EXACTLY "额外触发2次 · 仅在解梦触发".
Panel D heading EXACTLY "齿轮之心：持续强化".
Panel D caption EXACTLY "解梦永久 · 最终伤害−30%".
The complete names "凋零的梦" and "齿轮之心" must be clearly visible, not only shorthand 凋零/齿轮. Keep title "隐喻如何改写体验节奏", panels A/B, and footer "体验节奏假设 · 非实测" unchanged. Chinese modern NON-SERIF Microsoft YaHei style, panel letters and digits Georgia. Do not add prose, numeric emotion scores or change the plotted conceptual lines.
```

[最终图像](../assets/06-metaphor-rhythm.png) · [制作索引](README.md)
