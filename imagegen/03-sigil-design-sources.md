<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 徽记设计来源与触发类型

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：图1 初次生成

```text
Use case: infographic-diagram. Asset type: high-end static figure for a Chinese game SYSTEM DESIGN portfolio report about Wuthering Waves. Produce an impeccably art-directed BLACK AND GOLD information graphic, not a webpage, not a wireframe, not a screenshot of code, not boxes of prose. The whole image must look like a premium AAA game design presentation: warm near-black matte background, restrained brushed champagne-gold lines and accents, crisp ivory typography, elegant spacing, strong visual hierarchy. No game characters, no scenery, no logos, no ornate decorative clutter. Chinese type must visually match Microsoft YaHei (微软雅黑); English and numerals must visually match Georgia. Chinese labels must be rendered EXACTLY as supplied, clearly legible at normal report size. Use large type, very few words, no explanatory paragraphs, no invented numbers. Keep comfortable outer margins. Deliver one finished high-resolution raster image, approximately 4:3 landscape. Do not add watermark, code, UI chrome, or additional text.
Primary request: Figure 1 must show HOW THE TWELVE SIGILS ARE DESIGNED FROM EXISTING GAME MECHANISMS OR MODE-SPECIFIC RULES. It is an analytical reconstruction, not official design history. Title exactly "徽记的设计来源". Small top column labels "既有战斗基础" and "徽记". A distinct lower section titled "模式专属设计".
Layout: a clear paired-node dependency map, grouped by these small section headers: "动作机制", "生存资源", "角色特殊机制", "模式专属设计". EACH specific source mechanism gets its OWN small labeled node. Every connection must start at a concrete node, NEVER at a large group container. Align pairs so the viewer can immediately trace each arrow. Exactly twelve sigil name nodes, no omissions, no duplicate sigil names. Do NOT create a "伤害事件" category. Use subtle conceptual icons only if helpful.
Required connections, verbatim source -> sigil:
"普攻命中" -> "热焰"
"声骸技能" -> "飓风"
"共鸣解放" -> "雷暴"
"变奏技能" -> "冰绽"
"重击" -> "坚盾"
"护盾" -> THE SAME "坚盾" node (merge two short clearly traceable connections; do not duplicate 坚盾)
"生命资源" -> "狂欢"
"风蚀 / 光噪" -> "剥蚀"
"霜渐" -> "霜灭"
"聚爆" -> "瞬燃"
"震谐 / 谐度破坏" -> "谐度"
In the separate "模式专属设计" section: "叠层增益" -> "心流"; "时间控制" -> "时驭".
At the bottom a clean, short horizontal band labeled "解梦窗口" with one short line "公共强化与生效条件". This is a global modifier, NOT an exclusive source for only one sigil. No arrows from this band to all twelve (avoid visual spaghetti).
Only one small footer "分析性归类". Absolutely no long descriptions of each effect, percentages, catalog statistics, caveats or tables. Preserve rare Chinese names exactly: 热焰、飓风、雷暴、冰绽、坚盾、狂欢、剥蚀、霜灭、瞬燃、谐度、心流、时驭.
```

## 步骤2：图1 定向修正

```text
Edit the supplied infographic, preserving its premium black/gold style, all twelve sigil names, paired connections, icon design, and the bottom 解梦窗口 band.
Correct the grouping: move the existing "重击" source node OUT OF 生存资源 and into 动作机制 as its fifth individual source row. Keep "护盾" and "生命资源" in 生存资源. There must be exactly ONE "坚盾" node; connect BOTH the 重击 node in the action group and the 护盾 node in the survival group to that same 坚盾 with distinct easily traceable thin gold paths. A slight increase in vertical canvas space is fine. Every source has its own node; no connection starts at a section container. All other pairs must stay exactly unchanged: 普攻命中→热焰, 声骸技能→飓风, 共鸣解放→雷暴, 变奏技能→冰绽, 生命资源→狂欢, 风蚀/光噪→剥蚀, 霜渐→霜灭, 聚爆→瞬燃, 震谐/谐度破坏→谐度, 叠层增益→心流, 时间控制→时驭.
TYPOGRAPHY CORRECTION IS MANDATORY throughout: ALL Chinese text, including the large title and the four section headings, must use clean MODERN NON-SERIF MICROSOFT YAHEI / 微软雅黑-style typography. Same sans-serif family as the small body labels, bold for the title, medium for headings. NO Song/Ming/Simsun, no Kai, no calligraphic brush strokes, no thick-thin stroke contrast or serifs in ANY Chinese heading. English/numerals may use Georgia. Preserve the exact Chinese text and avoid introducing additional explanations.
```

## 步骤3：figure1

```text
Edit the supplied infographic with a SINGLE VISUAL CHANGE: make SOURCE mechanisms and RESULT sigils clearly different through much stronger block-color contrast. Preserve the layout, ALL text, ALL icons, ALL arrows, all twelve sigils, and the one shared 坚盾 node exactly. Preserve the black/champagne-gold style.
All concrete mechanism source pills in the middle-left column ("普攻命中", "声骸技能", "共鸣解放", "变奏技能", "重击", "护盾", "生命资源", "风蚀 / 光噪", "霜渐", "聚爆", "震谐 / 谐度破坏", "叠层增益", "时间控制") should have a visibly COOL DEEP SLATE BLUE-GRAY solid fill, subdued silver-gray borders and ivory text/icons.
All twelve sigil result pills in the right column should have a noticeably BRIGHTER CHAMPAGNE GOLD / muted metallic gold solid fill, with dark charcoal text/icons for high contrast. NOT both groups near-black with similar gold edges. The observer must distinguish original mechanism vs constructed sigil at first glance.
Do not recolor the whole section panels or background. Keep category headers and the bottom 解梦窗口 band as they are. Preserve Chinese NON-SERIF Microsoft YaHei-style text, not Song/Ming/Kai. Preserve Georgia for any English or digits. No additional labels, no typography changes, no new or missing links.
```

## 步骤4：完整编辑提示词

```text
Use case: text-localization / precise infographic edit.
Edit the supplied black-and-gold figure "徽记的设计来源". Make ONLY a COLOR CLASSIFICATION change in the RIGHT-HAND 徽记 column, plus a small two-swatch legend. Preserve the title, ALL source nodes, all group headings, all twelve sigil names, exact icons, all directional connections, and the existing 解梦窗口 band. Do NOT move 重击 into 生存资源. Keep exactly one 坚盾 receiving BOTH 重击 and 护盾. Keep all left/middle source nodes their existing dark blue-gray, without recoloring those sources.
The right column must visually distinguish the two already-established BASE MAIN-BENEFIT rhythm types:
TYPE A: "常态可用，入梦增强" — EXACTLY 热焰、飓风、雷暴、冰绽. Keep these FOUR nodes champagne-gold (#D8BC76-ish), with dark high-contrast text/icons. Their basic benefits can trigger before the dream state and are strengthened inside it.
TYPE B: "主收益由解梦开启" — EXACTLY 坚盾、狂欢、剥蚀、霜灭、瞬燃、谐度、心流、时驭. Color these EIGHT nodes muted JADE/TEAL green (#7BA99A-ish), with dark high-contrast text/icons. Use the SAME jade color for all eight, never gold. This is classification of main benefits, not a claim that every auxiliary effect is silent outside the dream state.
The new jade should harmonize with the matte black, champagne-gold frames/arrows and blue-gray source nodes, while being clearly distinct from both the gold category and the dark source column. No saturated neon green, purple, rainbow palette, red danger highlights, or low-contrast dark-on-dark nodes.
Add one concise, legible legend BELOW the dependency map and close to the bottom global band: gold swatch + exact label "常态可用，入梦增强"; jade swatch + exact label "主收益由解梦开启". If needed extend the bottom canvas margin slightly to fit one tidy horizontal legend row, without squeezing or deleting any existing nodes or band. Do not add item descriptions, state meters, new arrows, numeric effects, long caveats, extra categories, or another chart.
Chinese MUST remain modern NON-SERIF Microsoft YaHei/微软雅黑-style, no Song/Ming/Kai/calligraphic serifs. Preserve premium static editorial style and all source-to-sigil mappings:
普攻命中→热焰; 声骸技能→飓风; 共鸣解放→雷暴; 变奏技能→冰绽; 重击＋护盾→同一个坚盾; 生命资源→狂欢; 风蚀 / 光噪→剥蚀; 霜渐→霜灭; 聚爆→瞬燃; 震谐 / 谐度破坏→谐度; 叠层增益→心流; 时间控制→时驭.
Do not invent or omit names. Only right-node category colors and their small legend change.
```

## 2026-10-07核验后的范围修正

分类对象为基础主效果，隐喻可改写；时驭退出结算用解梦循环表达。

```text
Edit the supplied black/gold/jade "徽记的设计来源" diagram. Change ONLY the JADE legend label and add one short scope footer. Keep all twelve names, four gold nodes and eight jade nodes, source nodes, headings, icons, arrows and the 解梦窗口 band exactly unchanged.
Replace the jade legend "主收益由解梦开启" with EXACTLY "主收益依赖解梦循环". Keep gold legend EXACTLY "常态可用，入梦增强".
Below the two-swatch legend add one quiet readable line EXACTLY "按基础徽记主效果归类 · 隐喻可改写". A slight increase of bottom margin is allowed solely for this note. It is essential that the figure does not classify a fully developed build, all core metaphors, or all passive effects as inactive outside dream.
The wording 解梦循环 includes activation, during-state effects, and exit settlement. This is important because 时驭 settles damage when exiting the dream state; 坚盾 can accumulate 荣耀 outside dream; 狂欢 has healing outside dream; and metaphor effects may alter timing. DO NOT add these explanations to the artwork. Only the exact legend and one scope line are added.
Preserve harmonious champagne-gold and muted jade category colors, blue-gray sources, modern NON-SERIF Microsoft YaHei-style Chinese and existing polished composition. Do not recolor 霜灭: the BASE periodic freeze and extra frost application explicitly require 解梦. No new category, new graph, numeric effect, paragraph or missing sigil.
```

[最终图像](../assets/03-sigil-design-sources.png) · [制作索引](README.md)
