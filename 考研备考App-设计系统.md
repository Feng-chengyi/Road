---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: b245f765255405edd35236e132d736fa_551715f1696011f1aa625254006c9bbf
    ReservedCode1: KHnA5t9lqRDJgGGDBuabn8hAvU/ZFbaFsgF7kAGJLWQQ8xOmVjpwuEbNzJAoxV9zVPRRIQA2wI8zUybLMfqYTtNe38MrBjKR5qvY1nUQimpvH0l5ph0a1BHcSF+cEyEB5Ie2MikoD2c+lmcwTwetsCyVjTzx1TFfZNPSM82V7l14tOcr/1A/Qn2FyLE=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: b245f765255405edd35236e132d736fa_551715f1696011f1aa625254006c9bbf
    ReservedCode2: KHnA5t9lqRDJgGGDBuabn8hAvU/ZFbaFsgF7kAGJLWQQ8xOmVjpwuEbNzJAoxV9zVPRRIQA2wI8zUybLMfqYTtNe38MrBjKR5qvY1nUQimpvH0l5ph0a1BHcSF+cEyEB5Ie2MikoD2c+lmcwTwetsCyVjTzx1TFfZNPSM82V7l14tOcr/1A/Qn2FyLE=
---

# 研途 — 考研备考进度追踪 App 设计系统

## 1. 品牌定位

| 项目 | 内容 |
|------|------|
| 产品名称 | 研途 |
| 产品类型 | 教育 / 考研备考进度追踪 |
| 目标用户 | 22-28岁考研备考生，以在校生和在职备考者为主 |
| 设计风格 | 简洁专业、卡片式布局、支持深色模式 |
| 平台 | iOS / Android 移动端 |

## 2. 色彩系统

### 深色模式（默认推荐）

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#0B1120` | 主背景 |
| `--bg-secondary` | `#151D2E` | 卡片/容器背景 |
| `--bg-tertiary` | `#1E293B` | 悬浮卡片、输入框背景 |
| `--brand-primary` | `#6366F1` | 主色调，按钮、选中态 |
| `--brand-secondary` | `#818CF8` | 浅主色，hover 态 |
| `--accent-green` | `#22C55E` | 完成/进度/正向指标 |
| `--accent-amber` | `#F59E0B` | 提醒/待处理/警告 |
| `--accent-red` | `#EF4444` | 逾期/删除/错误 |
| `--text-primary` | `#F1F5F9` | 主文字 |
| `--text-secondary` | `#94A3B8` | 次要文字 |
| `--text-tertiary` | `#64748B` | 辅助文字 |
| `--border-default` | `#1E293B` | 默认边框 |
| `--border-subtle` | `#334155` | 浅边框 |

### 浅色模式

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#F8FAFC` | 主背景 |
| `--bg-secondary` | `#FFFFFF` | 卡片/容器背景 |
| `--bg-tertiary` | `#F1F5F9` | 输入框背景 |
| `--text-primary` | `#0F172A` | 主文字 |
| `--text-secondary` | `#475569` | 次要文字 |
| `--text-tertiary` | `#94A3B8` | 辅助文字 |
| `--border-default` | `#E2E8F0` | 默认边框 |

## 3. 图表色板

用于看板页面中各科目的颜色区分：

| 科目 | 色值 | 
|------|------|
| 政治 | `#F97316` (橙) |
| 英语 | `#3B82F6` (蓝) |
| 数学 | `#EF4444` (红) |
| 专业课 | `#8B5CF6` (紫) |
| 其他 | `#22C55E` (绿) |

## 4. 字体系统

| 层级 | 字体 | 字重 | 字号 | 行高 | 用途 |
|------|------|------|------|------|------|
| Display | PingFang SC / Noto Sans SC | 700 | 28px | 1.3 | 页面大标题 |
| H1 | PingFang SC / Noto Sans SC | 600 | 22px | 1.4 | 卡片标题 |
| H2 | PingFang SC / Noto Sans SC | 600 | 18px | 1.4 | 章节标题 |
| Body | PingFang SC / Noto Sans SC | 400 | 15px | 1.6 | 正文 |
| Body-Small | PingFang SC / Noto Sans SC | 400 | 13px | 1.5 | 辅助信息 |
| Caption | PingFang SC / Noto Sans SC | 400 | 11px | 1.4 | 标签/说明 |
| Number | SF Pro / Inter | 600 | 32px | 1.2 | 数据指标数字 |
| Number-Small | SF Pro / Inter | 500 | 16px | 1.3 | 小数据数字 |

## 5. 间距系统

| Token | 值 | 用途 |
|-------|------|------|
| `--space-xs` | 4px | 图标与文字间距 |
| `--space-sm` | 8px | 紧凑元素间距 |
| `--space-md` | 12px | 列表项间距 |
| `--space-lg` | 16px | 卡片内边距、组件间距 |
| `--space-xl` | 20px | 区块间距 |
| `--space-2xl` | 24px | 页面边距 |
| `--space-3xl` | 32px | 大区块间距 |

## 6. 圆角与阴影

| Token | 值 | 用途 |
|-------|------|------|
| `--radius-sm` | 8px | 小按钮、标签 |
| `--radius-md` | 12px | 卡片、输入框 |
| `--radius-lg` | 16px | 大卡片、弹窗 |
| `--radius-full` | 9999px | 胶囊按钮、头像 |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.3)` | 卡片阴影 |
| `--shadow-elevated` | `0 4px 12px rgba(0,0,0,0.4)` | 弹窗/浮层阴影 |

## 7. 组件状态

| 组件 | Default | Hover | Active | Disabled | Error |
|------|---------|-------|--------|----------|-------|
| 主按钮 | `bg-brand-primary` | `bg-brand-secondary` | `scale-0.97` | `opacity-40` | — |
| 输入框 | `bg-tertiary border` | `border-brand-primary` | `border-brand-primary` | `opacity-50` | `border-accent-red` |
| 卡片 | `bg-secondary shadow-card` | `shadow-elevated` | — | — | — |
| Tab | `text-tertiary` | `text-secondary` | `text-primary + underline` | — | — |

## 8. 图表规范

| 数据 | 图表类型 | 库推荐 | 颜色策略 |
|------|---------|--------|---------|
| 每日学习时长趋势 | 折线图 (Line Chart) | Chart.js / Recharts | 主色渐变填充 20% 透明度 |
| 各科目学习时间分布 | 柱状图 (Bar Chart) | Chart.js / Recharts | 每科目独立色，降序排列 |
| 科目完成进度 | 环形图 (Donut Chart) | Chart.js | 5-6 色，大块优先 |
| 计划完成率 | 进度环 (Progress Ring) | SVG 手绘 | 绿→黄→红渐变 |
*（内容由AI生成，仅供参考）*
