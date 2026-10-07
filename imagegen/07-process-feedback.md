<!--
[INPUT]: 作者图意、规则和已保存的制作指令
[OUTPUT]: 本图生成及定向编辑的完整提示词
[POS]: 制作证据；最终PNG见assets，不构成实机截图
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 过程反馈方案

工具：内置imagegen。具体模型型号未由工具返回。以下保留实际提示词；编辑按顺序以上一阶段输出为输入，历史候选图不作为最终正文插图。

## 步骤1：figure5

```text
Use case: infographic-diagram. Create one high-quality, IMAGE-LED static concept illustration for a Chinese Wuthering Waves system-design portfolio report. This is a proposed feedback design, NOT an in-game screenshot. Approximately 4:3 landscape, high-resolution. Match the report's premium near-black matte / champagne-gold visual language. Chinese lettering MUST be crisp modern NON-SERIF Microsoft YaHei (微软雅黑) style, NOT Song/Ming/SimSun/Kai/calligraphy; English/roman numerals Georgia. Strong art direction, ivory type, clean spacing, few words. Do not turn this into a table or a block of paragraphs.
Title EXACTLY "不同反馈类型的优化方式".
Three clear illustrated columns, each with a DISTINCT gameplay situation rather than a row of text. Use anonymous stylized combatant silhouettes, simple enemy silhouettes and conceptual HUD elements, not recognizable game characters, not faces, not logos, not fake measured game data.

LEFT column heading "瞬时触发". Illustrate a combatant performing a focused attack, a lightning-like extra strike on a target, and a nearby SIGIL ICON visibly flashing once. Small gold sound-wave arcs connect actual trigger to sound, showing an immediate reward cue. A small restrained progression uses labels "有效动作" → "实际生效" → "短音与短亮". Do NOT show feedback merely for pressing a button; do NOT illustrate multiple per-hit alerts. The effect belongs to a confirmed trigger.

MIDDLE column heading "持续状态". Illustrate two related vignettes: an enemy carrying a stylized dark-red/gold fissure MARK that grows clearer in three stages, and a player silhouette with layered warm GOLD rune/glow strength that deepens with an actual buff. These are status indicators, NOT bleeding wounds or low-health warnings. Show visually progressing status strength, not full-screen flashes. Small labels only "目标状态标记" and "强化层级渐变"; a small note "绑定实际增益". No health bars, no HP numbers, no percentages, no gore.

RIGHT column heading "阶段结算". Illustrate a short three-stage temporal sequence: a sigil/clock ring establishing a controlled state, a concentrated gold burst at actual payout, then the ring returning to a calm dim state. Use three labels "建立" → "结算" → "回落". The peak is at actual settlement, not merely entering the state. Emphasize visual beginning and ending clearly, not a permanent loud glow.

Footer EXACTLY "按反馈对象区分 · 方案示意".
A second short footer line "同一徽记可包含多种反馈".
All columns should be mostly compelling pictures and succinct labels. Preserve readable contrast and generous margins. No numerical performance claims, no success-rate charts, no explanatory paragraphs, no elaborate fake application shell, no alternative design controls or interactive elements.
```

## 步骤2：定向编辑

```text
Edit the supplied premium black/gold Chinese game-design concept infographic. Preserve the LEFT "瞬时触发" illustration and the MIDDLE "持续状态" illustration, their characters, effects, icons and succinct labels. The author rejects phase settlement as a proposed new feature: phase entry/exit is ALREADY communicated by the game's dream energy/progress bars. The scope must now be TWO PROPOSED improvements and ONE EXISTING mechanism retained.
1. Change the main title EXACTLY to "补足过程反馈，保留阶段提示".
2. Add a small champagne-gold badge "本次优化" to each of the left and middle panels. Do not otherwise change their artwork or labels.
3. REBUILD the right panel as EXISTING baseline, with header EXACTLY "已有阶段提示" and a restrained silver/gray badge "保留". Use visibly cooler, muted blue-gray/ivory treatment for this panel, so it is not promoted as a third gold improvement.
Remove the old concentrated gold burst, the large settlement ring, and the old 建立→结算→回落 sequence from the right panel. Instead illustrate TWO simple conceptual HUD progress bars, with labels "梦境能量条" and "解梦进度条". Show one as charging/ready and the other as state-duration progress. Do not add numerical values, measurements, rewards, a countdown or exact game screenshots. Small note only "进入与退出已覆盖". A dim anonymous battle silhouette/background may remain. This is a SCHEMATIC reference to existing function, not a faithful recreation of the game's UI. No new phase alerts or phase sound effects.
4. Replace the main footer with EXACTLY "新增过程反馈 · 保留已有阶段提示". Below it put only "方案示意 · 非实机截图".
Maintain Chinese modern NON-SERIF Microsoft YaHei / 微软雅黑-style lettering, no Song/Ming/Kai or brush/serif titles. English/numerals Georgia if present. Keep the near-black/champagne-gold overall art direction and the existing composition, but clear semantic visual separation between the two proposed panels and the existing muted panel. No text tables, no explanatory paragraphs, no extra components, no new game characters or logos. Do not frame existing energy bars as a new invention.
```

## 步骤3：定向编辑

```text
Edit this supplied black/gold Chinese game-design infographic. The author requests a CHANGE OF READING ORDER AND FRAMING, not a new game mechanic.
Reorder the THREE ENTIRE PANELS as follows:
LEFT = the old right EXISTING phase-information panel with the two dream energy/progress bars;
CENTER = the old left ACTION trigger-feedback illustration;
RIGHT = the old middle STATE-strength illustration.
Move each panel's content together, not just headings. Preserve the characters, status marks, actual-trigger emblem and sound-wave illustrations. Preserve the black/champagne-gold visual language, modern NON-SERIF Microsoft YaHei-style Chinese and Georgia English if any.

Replace main title EXACTLY with "强化阶段中的过程反馈".
LEFT panel heading EXACTLY "已有阶段信息". Remove the "保留" badge entirely; do NOT replace it with any deletion/retention decision badge. Keep this panel cool blue-gray/ivory and visually quieter. Keep labels "梦境能量条" and "解梦进度条". Replace its lower small sentence "进入与退出已覆盖" with "知晓所处阶段". It is explanatory context: the player already knows the current phase. Do not introduce a new bar, phase notification or settlement effect.
CENTER heading EXACTLY "动作触发反馈". Keep the small gold badge "本次优化" and the three concise labels "有效动作" → "实际生效" → "短音与短亮". Communicate that stronger feedback during the enhancement period confirms a valid action caused the sigil effect.
RIGHT heading EXACTLY "状态作用反馈". Keep gold badge "本次优化", enemy status progression, player buff-glow progression, labels "目标状态标记", "强化层级渐变", and "绑定实际增益". Communicate that the state actually helps, rather than only displaying that a phase has begun.

Replace the large footer EXACTLY with "强化过程感知：动作起效，状态有用".
Small footer EXACTLY "方案示意 · 非实机截图".
The word "保留" MUST NOT appear ANYWHERE in the image. Do not depict stage entry/exit as part of our proposed improvements. Do not include "建立→结算→回落" or a new phase timeline. Keep only the two existing conceptual bars at left as context. No explanatory paragraphs, no table, no additional panels, no new characters or logos. Maintain clean spacing and very legible exact simplified Chinese lettering.
```

[最终图像](../assets/07-process-feedback.png) · [制作索引](README.md)
