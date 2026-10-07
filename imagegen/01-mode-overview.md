<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 单局玩法总览

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：overview

```text
Create a premium static explanatory FLOW DIAGRAM for a Chinese Wuthering Waves system-design portfolio report, for readers who have never played the mode. Warm near-black matte background; restrained champagne-gold and ivory; a few muted blue-gray resource accents; elegant AAA editorial infographic, same black-and-gold family as polished game-system report figures. NOT a webpage, NOT HTML, NOT a dense text table, NOT an actual game screenshot. Chinese typography MUST be modern NON-SERIF Microsoft YaHei (微软雅黑)-style, NO Song/Ming/Kai or calligraphy. English and numerals Georgia-style. Large, clearly readable exact simplified Chinese. Landscape around 4:3, generous margins. No watermark or official logos.
Title EXACTLY "千道门扉的异想：单局玩法总览".
A small top subtitle "周度游历 · 战斗玩法".
Build one coherent flow with arrows that clearly communicate actual dependency. MAIN ROUTE across the upper-middle:
"带入已有角色" (three small character silhouettes) → "选择徽记" (single gold core emblem, small caption "确定本局构筑核心") → "关卡战斗" (crossed swords) → "普通最终Boss" → "结算游历值".
A quiet OPTIONAL side branch from 普通最终Boss leads to "追加挑战Boss" with small label "可选 · 不作为周奖门槛", and rejoins the SAME 结算游历值 node. Keep the DIRECT arrow from 普通最终Boss to 结算游历值 clearly visible. There is no mandatory extra boss gate or second reward chest.
Near the main route at lower right add a simple reward chest and a concise note "普通最终Boss通关 → 一局达成周奖目标"; small line "失败也可累计已得进度". Reward goal is separate from the optional challenge.
Two clearly grouped LOCAL LOOPS below the main route, returning only to 关卡战斗, without crossing or confusing arrows:
LEFT growth loop, group title "局内成长":
A reward card node "选择隐喻" with two short sublabels "强化构筑" and "通用成长".
A small merchant stall node "商店" with a SINGLE coin icon labelled "局内货币" and short sublabels "购买通用隐喻", "固定3件折扣", "不出售核心隐喻".
These are alternative/interspersed growth opportunities, NOT mandatory after every battle. Both feed "更新构筑" then an arrow back to 关卡战斗. Core metaphors are obtained through choices, NOT sold in the shop.
RIGHT combat-state loop, group title "解梦强化":
"战斗积累梦境能量" (energy meter, distinct from coin) → "能量满：开启解梦" → "徽记唤醒 / 强化" → back to 关卡战斗. Dream energy is NOT a second shop currency. All energy arrows must connect to the combat-state group.
A compact side note near 带入已有角色 "本期援护：角色加分 / 属性加伤", with short line "加成不构成达标门槛". It is a period bonus, not another initial core choice or required party restriction.
Footer EXACTLY "机制总览 · 非实机界面".
Keep text concise, gold for main path and meaningful upgrades, blue-gray for resources, thin directional arrows. No prices, point calculations, fabricated scores, stage counts, random probabilities, numerical damage claims or tutorial paragraphs. Diagram should make it immediately clear what the mode is, how a run grows, how energy activates the core, and how weekly progress is earned.
```

## 步骤2：overview局部循环箭头修正

```text
Edit this supplied Chinese black/gold single-run overview diagram. Keep ALL artwork, exact labels, nodes, placement and typography unchanged. Fix ONLY TWO flow directions in the local loops below 关卡战斗:
1 The UPPER GOLD path between 关卡战斗 and the fork above 选择隐喻 / 商店 must run FROM 关卡战斗 TO the growth opportunities. Remove the upward arrowhead at the battle end of this upper gold path; show its gold direction flowing down/left to the fork and into the two opportunities. Preserve the LOWER return path from 更新构筑 back UP INTO 关卡战斗.
2 The UPPER BLUE path between 关卡战斗 and 战斗积累梦境能量 must run FROM 关卡战斗 DOWN INTO 战斗积累梦境能量. Remove its upward arrowhead at the battle end and place a clear arrowhead at the energy accumulation node. Preserve the existing chain down to 能量满：开启解梦 and 徽记唤醒 / 强化, and preserve the LOWER return path from that awakened state UP INTO 关卡战斗.
Thus both loops visually show battle → gain/growth → battle, rather than all arrows pointing toward battle with no inputs. Do not change the main horizontal route, optional boss branch, shop rules, coin, core emblem, reward notes, colors, Chinese text or footer. No new nodes or annotations.
```

[最终图像](../assets/01-mode-overview.png) · [制作索引](README.md)
