---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: b245f765255405edd35236e132d736fa_56477ef2696011f18805525400d9a7a1
    ReservedCode1: j+13hgvXzHbFfmJRZtiTMC1C5q2tZJVhGN78IjeuXegpomFVpoRRfmCglQgEASuxn57CjBrdWgrX8kiGg5EY20KI/peeHg/rOPsiCBG3RySMnd//YoQyi+5GBRV8j1T0dlkuskUyp+0XyI6ccPgJ/6SHwB4dMloZFFiUxTNDgVNIdo8rg6jR0fTL67s=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: b245f765255405edd35236e132d736fa_56477ef2696011f18805525400d9a7a1
    ReservedCode2: j+13hgvXzHbFfmJRZtiTMC1C5q2tZJVhGN78IjeuXegpomFVpoRRfmCglQgEASuxn57CjBrdWgrX8kiGg5EY20KI/peeHg/rOPsiCBG3RySMnd//YoQyi+5GBRV8j1T0dlkuskUyp+0XyI6ccPgJ/6SHwB4dMloZFFiUxTNDgVNIdo8rg6jR0fTL67s=
---

# 研途 App — AI 绘图提示词集合

用于 Midjourney / DALL-E / Stable Diffusion 生成考研备考 App UI 界面。

---

## 全局风格设定

所有页面共享的视觉基调：

```
Mobile app UI design, Chinese exam preparation tracker, modern clean interface,
dark mode with deep navy background #0B1120, card-based layout with rounded
corners (radius 12-16px), indigo accent color #6366F1, green completion indicators
#22C55E, glass-morphism cards on dark background, subtle shadows, SF Pro Display
for numbers, PingFang SC for Chinese text, minimal data visualization with Chart.js
style, 430x932px mobile screen, iOS style, professional education app, no emoji,
flat icons Lucide style, 8pt grid system, high contrast WCAG AAA
```

---

## 页面 1：学习数据看板 (Dashboard)

### Midjourney Prompt

```
Mobile app screen, dark mode, exam preparation tracking dashboard, iOS style --
Top section: greeting text "Good Morning" in Chinese, countdown "187 days until exam",
circular avatar with initial. Three metric cards in a row showing "6.5h Today's Study",
"128 Total Days", "78% Weekly Rate" with large bold numbers and small labels,
indigo and green accents on deep navy cards. Middle section: Line chart showing
daily study hours trend (Mon-Sun) with indigo gradient fill, smooth curves.
Two-column grid below: left card has horizontal bar chart showing study time
by subject (Politics orange, English blue, Math red, Professional purple),
right card has donut chart showing subject completion progress with 4 colored
segments. Bottom section: "Pending Plans" list with 3 items, each showing subject
icon, task name, time, and empty checkbox circles. "Recent Records" timeline with
green dots and timestamps. Dark background #0B1120, cards #151D2E, indigo accent
#6366F1, clean sans-serif Chinese typography, minimal professional style,
no emoji, 430x932 mobile frame --v 6.0 --style raw
```

### DALL-E Prompt

```
A mobile app UI screenshot showing a dark mode exam preparation dashboard.
Background is very dark navy blue (#0B1120). At the top, a greeting "早上好" 
with a countdown chip "距考研还有187天" and a small purple avatar circle.
Three stat cards side by side: "6.5 今日学时(h)" in green, "128 累计天数"
in white, "78% 本周完成率" in light indigo. Below, a smooth line chart with
indigo gradient fill showing 7 data points for a week's study hours. Then two
cards side by side: left shows a colorful horizontal bar chart (orange, blue,
red, purple bars), right shows a donut ring chart. At bottom, two list sections:
"待完成计划" with 3 task items and circular checkboxes, and "近期学习记录" 
with green-dotted timeline entries. Card-based layout, rounded corners, clean
Chinese typography, professional minimal style. No text decorations or emoji.
```

---

## 页面 2：备考科目管理 (Subject Management)

### Midjourney Prompt

```
Mobile app screen, dark mode, subject management page for exam prep app --
Title "备考科目" at top. Four stacked cards, each card shows: circular colored
icon with Chinese subject initial (政/orange, 英/blue, 数/red, 专/purple),
subject name, target score and daily hours in small text, thin progress bar
with percentage. Last card more faded. "更多" button with three dots on each card.
Bottom has outlined "添加科目" (Add Subject) button with plus icon.
Dark background #0B1120, cards #151D2E with subtle border, indigo accents,
modern minimal card UI, Chinese interface, 430x932 mobile frame --v 6.0
```

### DALL-E Prompt

```
A mobile app screen showing a dark mode subject management page. Dark navy
background with four card rows. Each card has a colored rounded square icon
with a Chinese character (政 in orange, 英 in blue, 数 in red, 专 in purple),
the subject name in bold white text, and "目标XX分·每日Xh" in small gray text.
Each card has a thin horizontal progress indicator bar showing 30-60% fill.
A subtle three-dot menu icon on the right of each card. At the bottom, a
ghost button reading "添加科目" with a plus icon. Clean Chinese typography,
card-based layout with rounded corners, professional minimal style.
```

---

## 页面 3：计划安排 (Plan Schedule)

### Midjourney Prompt

```
Mobile app screen, dark mode, daily study plan schedule page --
Title "学习计划" with "今日完成率 75%" in green below. Horizontal date picker
with 5 day chips: Monday 16 highlighted in indigo, Tue-Sat in subdued style.
Three time-block sections labeled "上午" (Morning/amber), "下午" (Afternoon/indigo),
"晚上" (Evening/purple), each with small sun/moon icon. Each section contains
1-2 plan cards: left color strip (green=done, gray=pending), task name in Chinese,
time range, green checkmark circle or empty checkbox. One pending card dimmed.
Toggle switch card at bottom "计划提醒 提前15分钟通知". "添加计划" primary
indigo button at bottom. 430x932 mobile frame --v 6.0
```

### DALL-E Prompt

```
A mobile app UI showing a dark mode daily study plan schedule. Title reads
"学习计划" with green "75%" completion text. A horizontal scrollable date strip
shows 5 circular date chips (周一16 highlighted indigo, others gray). Three
time sections: "上午" with amber sun icon, showing 1 completed plan card with
green checkmark; "下午" with indigo icon, showing 2 completed plans; "晚上"
with purple moon icon, showing 1 pending dimmed card. Each plan card has a
left accent color strip, Chinese task description, time range, and completion
checkbox. A reminder toggle card below. Indigo primary button "添加计划"
at bottom. Dark navy background, card layout, clean professional style.
```

---

## 页面 4：注册引导 (Onboarding)

### Midjourney Prompt

```
Mobile app screen, dark mode, exam prep app onboarding flow --
Top: horizontal step indicator with 4 numbered circles (step 1 green checkmark
done, step 2 indigo active, steps 3-4 gray pending), connected by thin lines.
Title "基本信息" (Basic Info) with subtitle. Form fields stacked: "姓名" input
with placeholder value, "目标院校" input, "目标专业" input, all with labels
above. Two selectable card options "学术学位硕士" (selected with indigo border)
and "专业学位硕士" (unselected). Bottom: two buttons side by side -- "上一步"
outlined and "下一步" filled indigo. Clean form design, rounded input fields,
dark background, professional Chinese typography, 430x932 mobile frame --v 6.0
```

### DALL-E Prompt

```
A mobile app onboarding screen in dark mode. Top shows a 4-step progress
indicator: circle 1 with green checkmark, circle 2 highlighted indigo, circles
3-4 gray with thin connecting lines. Title "基本信息" with subtitle text.
Form fields: "姓名" with "李明" pre-filled, "目标院校" empty, "目标专业" empty,
all with labels and rounded input borders. Two selection cards: "学术学位硕士"
with indigo border (selected) and "专业学位硕士" (unselected gray border).
Two bottom buttons: "上一步" outlined gray, "下一步" solid indigo fill.
Clean form UI, dark navy background, professional minimal Chinese typography.
```

---

## 使用建议

| 工具 | 推荐用途 | 参数建议 |
|------|---------|---------|
| Midjourney | 整体页面感、氛围渲染 | `--v 6.0 --style raw --ar 9:19.5` |
| DALL-E 3 | 精确 UI 元素、文字准确性 | `--size 1024x1792` |
| Stable Diffusion | 批量变体生成 | 配合 ControlNet + IP-Adapter |
| Figma AI | 设计稿转可编辑组件 | 导入后微调颜色/间距 |

### 附加负向提示词 (Negative Prompt)

```
light mode, bright background, colorful gradients, neon, glowing, emoji,
cartoon style, 3D renders, photorealistic, cluttered, complex backgrounds,
hand-drawn, sketch, low contrast, small text, serif fonts, decorative borders
```
*（内容由AI生成，仅供参考）*
