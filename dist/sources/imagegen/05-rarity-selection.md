<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 稀有度提示与构筑成型

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：图3 初次生成

```text
Use case: infographic-diagram. Asset type: high-end static figure for a Chinese game SYSTEM DESIGN portfolio report about Wuthering Waves. Produce an impeccably art-directed BLACK AND GOLD information graphic, not a webpage, not a wireframe, not a screenshot of code, not boxes of prose. The whole image must look like a premium AAA game design presentation: warm near-black matte background, restrained brushed champagne-gold lines and accents, crisp ivory typography, elegant spacing, strong visual hierarchy. No game characters, no scenery, no logos, no ornate decorative clutter. Chinese type must visually match Microsoft YaHei (微软雅黑); English and numerals must visually match Georgia. Chinese labels must be rendered EXACTLY as supplied, clearly legible at normal report size. Use large type, very few words, no explanatory paragraphs, no invented numbers. Keep comfortable outer margins. Deliver one finished high-resolution raster image, approximately 4:3 landscape. Do not add watermark, code, UI chrome, or additional text.
Primary request: Figure 3 is a MACRO VIEW OF THE RUN'S MANY THREE-OPTION CHOICES, not detailed item cards. Title exactly "整局选择中的品质线索". Subtitle exactly "R04记录：19次隐喻选择". Exclude the opening sigil choice and shops.
Composition: a polished flow sequence of EXACTLY NINETEEN small choice groups, arranged in four columns by five rows, with the last row containing only three groups. Each group has its small number 01 through 19, exactly once, in reading order. EACH group contains exactly THREE slim upright cards. Cards have no item names or item descriptions, only small abstract symbolic silhouettes and their rarity color. Blue means 普通, purple means 高级, gold means 特级. Preserve the black/gold overall presentation; blue and purple are small rarity accents. Short faint links convey progression without clutter.
Only FOUR gold core cards carry a clearly recognizable thumbs-up recommendation badge, in groups 01, 04, 06, 12. Spread these badges naturally across the sequence; do NOT put a gold recommended card in every group. Other groups show varied blue/purple choices, and some gold cards WITHOUT a recommendation badge, so gold rarity and the recommendation mark are visibly different cues. Indicate selection with a restrained bright outline on a single card per group, favoring higher rarity. No extra cards and no twentieth group.
Small bottom legend only: blue "普通", purple "高级", gold "特级", thumbs-up "推荐".
A concise bottom progression caption: "品质与推荐线索" -> "构筑逐步成型" -> "完成周常目标".
Small footer exactly "配色与推荐为机制示意，非实机复原". The 19 count is the recorded R04 choice count; the unrecorded full card rarity distribution and recommendation placements are SCHEMATIC, not measured probabilities. No success rate, no percentages, no detailed inventory.
```

## 步骤2：图3 定向修正

```text
Edit the supplied macro choice-sequence image and preserve EXACTLY nineteen groups, numbered 01–19 in the same order, with EXACTLY three cards per group. Preserve all colors and card icons, preserve the FOUR thumbs-up badges only at groups 01,04,06,12, and keep all bottom text unchanged.
Fix selection outlines only: in groups 03,08,10,14,16,18, move the bright selected outline from the currently selected lower-rarity card to the GOLD card already in that same group. Do NOT change card colors or add recommendation badges. All other groups remain unchanged. A single card per group is selected; when gold is present it should be selected, otherwise select purple if present.
MANDATORY typography correction: every Chinese title, subtitle, legend and caption must be NON-SERIF Microsoft YaHei / 微软雅黑-style lettering, not the current traditional serif headings. The title "整局选择中的品质线索" should be a crisp bold modern sans-serif with NO Ming/Song/SimSun/Kai calligraphic character shapes. Preserve Georgia for English R04 and all group numbers. No extra text, no names on cards, no change to nineteen groups.
```

## 步骤3：figure3

```text
Edit the supplied image while preserving the entire 19-group choice grid, numbers 01–19 exactly once, exactly 3 cards per group, card colors/icons, all selection outlines, and exactly four thumbs-up marks only at groups 01,04,06,12. Keep premium black/gold styling, Chinese NON-SERIF Microsoft YaHei-style text and English/digits Georgia.
The image must explain a RARITY-RULE TEST AND ITS OUTCOME, not only an inventory of choices.
Replace the title VERBATIM with "基于稀有度规则的选择测试".
Replace the subtitle VERBATIM with "R04 · 19次隐喻选择 · 保持正常操作".
Add only a short rule line near the subtitle: "最高稀有度优先 · 同档取最左".
Replace the existing three-part lower ribbon with THREE clear outcome blocks, connected in order:
1 "普通最终 Boss" with a prominent gold checkmark and "通过".
2 "追加挑战 Boss" with a prominent gold checkmark and "通过".
3 a restrained reward-chest symbol and "本账号满奖路径可达".
This is the recorded combat result plus the account's previously confirmed ordinary-clear full-reward route, NOT a new measurement of points collected during R04. Do NOT write "R04从零拿满", numeric reward values, universal pass rates, or all-player guarantees.
Keep the small rarity legend 普通 / 高级 / 特级 / 推荐, and replace footer with "本账号观察 · 卡色与推荐为机制示意".
A little extra lower canvas height is allowed to keep outcome text legible. No other prose, no item names, no twentieth group, and do not change the original logic or selections.
```

## 步骤4：hint

```text
Edit the supplied black/gold image. Preserve all nineteen groups numbered 01–19, exactly three cards per group, colors/icons, selections, and exactly four recommendation badges. Preserve the two boss-success results and the reward-route result, and the rarity legend. Do not redraw or alter the selection data.
The purpose is EASY BUILD FORMATION through SIMPLE RARITY CUES, not a dry academic test title.
Replace title EXACTLY with "跟随稀有度提示，也能完成挑战".
Keep subtitle "R04 · 19次隐喻选择 · 保持正常操作".
Replace the short rule text with "优先高稀有度 · 同档取最左".
In the reward outcome block replace "本账号满奖路径可达" with "周奖目标可达". Keep the chest.
Replace footer with "机制示意 · 非实机卡面".
No other copy changes. Chinese Microsoft YaHei-style NON-SERIF, English and numerals Georgia, same premium black/gold composition. No phrase "稀有度规则" anywhere; treat rarity as a player-facing hint. No percentages, no invented general success rates.
```

[最终图像](../assets/05-rarity-selection.png) · [制作索引](README.md)
