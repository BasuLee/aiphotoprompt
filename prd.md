
# 最终版项目开发需求文档 (PRD)

## 项目名称：AI Photo Prompt

  * **域名：** `ai-photo-prompt.com`
  * **版本：** V1.0 (MVP)
  * **产品目标：** 提供一个快速、高效、高质量的 AI 图像提示词 (Prompt) 示例检索与学习平台，支持中英双语用户。
  * **技术栈：** Next.js (SSR) + React + FlexSearch + Next.js i18n
  * **部署环境：** **Vercel**
  * **数据源json：** **data下边的json文件（2个不同模型的中英文版本共4个文件）**

-----

## 现有模块概览

| 模块 | 位置 | 责任说明 |
| :--- | :--- | :--- |
| 首页列表 | `src/pages/index.tsx` | 服务端按 locale 加载 `data/` JSON，初始化 FlexSearch 索引，调度 `SearchFilters` 与 `PromptCard` 实现搜索、筛选、排序与卡片网格展示。 |
| 提示词详情 | `src/pages/prompt/[id].tsx` | 读取单条提示词，结合 `getRecommendations` 补充相关推荐，调用 `SEO` 输出 canonical、结构化数据与面包屑。 |
| 全局布局 | `src/pages/_app.tsx`、`src/components/Layout.tsx` | 在应用层挂载 `Layout`，集中渲染 `Header`、`Footer`、多语言切换及各页面主体。 |
| 组件库 | `src/components/` | `SearchFilters`、`PromptCard`、`CopyButton`、`RecommendedPrompts`、`ImageDisplay`、`LanguageDropdown` 等封装 UI 与交互，包括复制提示词、图片占位/错误处理、分类翻译等。 |
| 业务逻辑库 | `src/lib/` | `data.ts` 负责数据加载与 slug 处理，`search.ts` 维护 FlexSearch，`recommendations.ts` 提供多种推荐策略，`categories.ts` 自动识别分类，`blog.ts` 保存多语言博文及 JSON-LD 工具。 |
| 静态内容 | `data/`、`public/locales/` | `data/` 下四个 JSON 划分模型与语言，`public/locales/` 提供 i18n 词条，配合 Next.js i18n 路由实现中英双语。 |
| 法务与信息页 | `src/pages/(blog|faq|contact|terms|privacy)` | 博客、FAQ、联系方式及合规页面全部支持 SSR 与多语言渲染，内容长度满足 SEO 需求。 |
| API 输出 | `src/pages/api/sitemap.xml.ts` | 聚合中英文首页与提示词详情页 URL，生成多语言 sitemap 并设置缓存策略。 |
| 类型与样式 | `src/types/index.ts`、`src/styles/globals.css` | 定义提示词、SEO 等 TypeScript 接口，集中维护 Tailwind 全局样式。 |

该概览反映当前代码结构，可作为迭代需求与测试覆盖规划的基线。

## 一、核心功能模块

### 1\. 首页/示例列表展示

| ID | 功能描述 | 交互细节 | 技术要点 |
| :--- | :--- | :--- | :--- |
| **1.1** | **规整网格布局** | 列表图以**一行 3 或 4 个**的规整网格形式展示，按顺序排列。图片使用 `object-fit: cover` 确保卡片高度和对齐一致。 | 使用 **CSS Grid** 或 **Flexbox**。图片使用 **PNG** 格式，存放在 public/assets 目录。 |
| **1.2** | **Prompt 卡片信息** | 每张卡片显示：**示例图**、**Prompt 简要**（限制 2 行）、**风格标签**、**模型/版本**。 | 所有信息都需支持**多语言切换**。 |
| **1.3** | **高性能搜索/筛选** | 顶部固定搜索框，支持中英文关键词**全文搜索**。提供按**模型、风格、热度**等筛选器。 | 使用 **FlexSearch** 实现**纯前端**高性能检索，英文环境搜索英文数据，中文环境搜索中文数据。 |
| **1.4** | **语言切换** | **导航栏**右侧设置显眼的\*\*“语言切换”按钮\*\*（如：中文/EN）。点击后即时切换所有 UI 文本。 | 必须使用 **Next.js i18n 路由**机制。 |

#### 首页样式参考图：example.png，可以按照这个样式去做

### 2\. Prompt 详情页

| ID | 功能描述 | 交互细节 | 技术要点 |
| :--- | :--- | :--- | :--- |
| **2.1** | **核心信息展示** | 左侧为**高清示例图**，右侧为**Prompt 文本**（核心内容）、**参数区**（模型、Seed、AR 等）。页面内容需支持**中英文切换**。页面底部添加相关推荐，确保内容达到 600+ 单词。 | 优化 SEO 标签和结构化数据。 |
| **2.2** | **一键复制 Prompt** | 显眼的\*\*"一键复制"**按钮。点击后**仅复制**用于 AI 生成的**完整 Prompt 文本\*\*（不包含任何中文/英文翻译的描述）。 | 集成 `clipboard-copy` 等库，并提供成功的反馈提示。 |

### 3\. 其他页面

| 页面 | 路径结构 | 功能描述 | 技术要点 |
| :--- | :--- | :--- | :--- |
| **Blog 目录页** | `/en/blog`, `/zh/blog` | 展示所有 Blog 文章列表，支持中英文切换。 | SSR 动态生成，响应式设计。 |
| **Blog 文章页** | `/en/blog/[slug]`, `/zh/blog/[slug]` | 5 篇文章：提示词用法、生成技巧、搜索方法、模型使用、作者答谢。每篇 600+ 单词。 | 支持多语言，SEO 优化。 |
| **FAQ 页面** | `/en/faq`, `/zh/faq` | 常见问题解答，内容充实，600+ 单词。 | 支持多语言，响应式设计。 |
| **Contact Us** | `/en/contact`, `/zh/contact` | 联系方式：firenull52@gmail.com，独立页面。 | 简洁设计，多语言支持。 |
| **Terms of Service** | `/en/terms-of-service`, `/zh/terms-of-service` | 法律条款页面，600+ 单词，全英文内容。 | SEO 优化，放置在页脚。 |
| **Privacy Policy** | `/en/privacy-policy`, `/zh/privacy-policy` | 隐私政策页面，600+ 单词，全英文内容。 | SEO 优化，放置在页脚。 |

-----

## 二、技术实现与数据规范

### 1\. 技术实现方案

| 技术点 | 方案选择 | 目的与要求 |
| :--- | :--- | :--- |
| **基础框架** | **Next.js (SSR)** | 利用 **SSR（服务端渲染）** 实现动态内容生成，保障 SEO 和性能。 |
| **国际化 (i18n)** | **Next.js 内置 i18n** | 管理多语言路由（`/en/` 和 `/zh/`）和 UI 文本的切换。根据语言环境分别加载对应的 JSON 数据文件。 |
| **数据源** | **本地 JSON 文件** | 使用 data 目录下的 4 个 JSON 文件（gpt-4o.en.json, gpt-4o.zh.json, nano-banana.en.json, nano-banana.zh.json），根据语言环境动态加载。 |
| **搜索** | **FlexSearch** | 索引需覆盖所有中英文描述和标签，确保搜索在**纯前端**实现。 |

### 2\. 数据源格式要求（JSON）

按照数据源json里的格式

-----

## 三、部署与 SEO 规范

### 1\. 部署方案

| 环节 | 方案 | 优势 |
| :--- | :--- | :--- |
| **部署环境** | **Vercel** | **Next.js 官方推荐**，提供极速的全球 CDN 边缘部署，与静态生成完美结合。 |
| **部署流程** | **Git 仓库关联 Vercel** | 实现**持续集成/持续部署 (CI/CD)**，每次代码推送自动构建和发布。 |

### 2\. 多语言 SEO 规范

| 策略点 | 具体要求 | SEO 目标 |
| :--- | :--- | :--- |
| **路由结构** | 必须使用语言前缀：英文 `ai-photo-prompt.com/en/...`，中文 `ai-photo-prompt.com/zh/...`。 | 帮助搜索引擎区分不同语言内容。 |
| **Hreflang 标签** | 在所有页面 `<head>` 中正确设置 **`hreflang` 标签**，指向对应的中英文版本。 | 避免重复内容惩罚，确保用户被引导至正确的语言页面。 |
| **URL 优化** | URL 中应包含对应语言的关键词（例如：`/en/best-portrait-prompt` 或 `/zh/zuijia-renxiang-tishi-ci`）。 | 提升关键词权重和本地化搜索排名。 |
| **内容优化** | 中英文内容的 **Title/Description** 必须分别针对各自语言的关键词进行优化。 | 最大化覆盖中英文搜索流量。 |

-----

## 四、开发优先级

### 第一阶段：核心功能完善
1. **修复现有项目配置**：解决 next.config.mjs 警告，优化数据加载性能
2. **完善 Prompt 展示功能**：
   - 更新数据类型，支持图片展示
   - 优化首页布局（参考 example.png）
   - 重新设计详情页（左图右文，添加相关推荐）
   - 实现图片展示和复制功能

### 第二阶段：多语言和 SEO
1. **多语言支持**：创建翻译文件，完善语言切换
2. **SEO 基础设施**：Canonical URL、Meta Description、Hreflang 等

### 第三阶段：新页面开发
1. **Blog 功能**：目录页 + 5 篇文章
2. **其他页面**：FAQ、Contact、Terms、Privacy

-----

这份 PRD 即为本次项目的最终开发依据。项目采用 SSR 渲染，支持完整的中英文多语言切换，图片资源存放在 public/assets 目录下。
