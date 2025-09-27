这是一份基于您的 **AI Photo Prompt** 项目 PRD 文档和额外 SEO/技术要求而整理的 **最终版项目开发需求文档 (MD 格式)**，以及一个详细的 **Todo List**。

-----

# AI Photo Prompt 项目最终开发需求文档

## 概述

本项目旨在构建一个高性能、SEO 友好且支持多语言的 AI 图像提示词（Prompt）示例检索平台。项目将采用 **Next.js SSR** 结合 **FlexSearch** 实现高性能搜索和动态内容生成，并使用 **Tailwind CSS** 统一视觉样式。

## 一、核心页面要求

| 页面 | URL 路径 | 核心内容与要求 | 额外规范 |
| :--- | :--- | :--- | :--- |
| **Home/List** | `/en/`, `/zh/` | **1.1 网格布局**: 规整网格，**一行 3 或 4 个**（响应式调整）。图片使用 `object-fit: cover` 确保卡片一致高度和对齐。使用 **PNG** 格式图片，存放在 public/assets 目录。**1.2 卡片信息**: 显示**示例图**、**Prompt 简要**（限 2 行）、**风格标签**、**模型/版本**。**1.3 高性能搜索**: 顶部固定搜索框，支持中英文**全文搜索**（模型、风格、描述）。使用 **FlexSearch** 纯前端实现。 | **SSR**: 必须通过 **SSR** 渲染。**i18n**: 完整支持中英文切换。|
| **Prompt Detail** | `/en/prompt/[slug]`, `/zh/prompt/[slug]` | **2.1 核心信息**: 左侧**高清示例图**，右侧**Prompt 文本**、**参数区**（模型、Seed、AR 等）。**2.2 复制功能**: 显眼的\*\*“一键复制”**按钮，仅复制用于 AI 生成的完整 Prompt 文本。| SEO: 核心 Prompt 文本需使用 JSON-LD Schema 标记。i18n: 完整支持中英文切换。单词数不低于 600 个（除主页外）。|
| Blog | `/en/blog`, `/zh/blog` | 导航栏添加 Blog 目录。内部需包含 5 篇 Blog 文章，内容涵盖：提示词的用法、提示词的生成技巧、提示词的搜索、模型的使用方法、对提示词作者的答谢。需通过丰富内容让页面充实。 | SEO: 每篇文章单词数尽量不低于 600 个。支持中英文切换。|
| FAQ | `/en/faq`, `/zh/faq` | 导航栏添加 FAQ 目录。页面内容需包含用户**常见问题及解决方案\*\*、**联系我们的方法**（邮箱：firenull52@gmail.com）。 | **SEO**: 页面单词数尽量不低于 **600** 个。支持中英文切换。|
| **Terms of Service** | `/en/terms-of-service`, `/zh/terms-of-service` | 独立的法律页面。入口必须放在**页面底部（页脚）**。 | 页面单词数尽量不低于 **600** 个。支持中英文切换。|
| **Privacy Policy** | `/en/privacy-policy`, `/zh/privacy-policy` | 独立的法律页面。入口必须放在**页面底部（页脚）**。 | 页面单词数尽量不低于 **600** 个。支持中英文切换。|

## 新增页面要求

| 页面 | URL 路径 | 核心内容与要求 | 额外规范 |
| :--- | :--- | :--- | :--- |
| **Contact Us** | `/en/contact`, `/zh/contact` | 独立的联系页面。显示联系邮箱：firenull52@gmail.com，包含联系表单和详细联系信息。 | 支持中英文切换，简洁设计。|

## 二、导航栏与页脚设置

| 元素 | 要求 | 包含内容 |
| :--- | :--- | :--- |
| **导航栏 (Navbar)** | **技术要求**: 页面切换必须**重新请求**，**禁止使用前端 JS 切换**。**i18n**: 导航栏右侧设置显眼的\*\*“语言切换”按钮\*\*（中文/EN），切换后即时刷新对应语言路由（`/en/` 或 `/zh/`）。 | **Home**、**Blog** (目录)、**FAQ** (目录)、**语言切换按钮**。|
| **页脚 (Footer)** | **禁止包含**: Home、Blog、FAQ。 | **Terms of Service**、**Privacy Policy**、**Contact Us**（链接至包含联系信息的页面，如 Blog 或 FAQ）。|

## 三、SEO 相关规范 (硬性要求)

1.  **Canonical URL**: 每个页面必须设置准确的 `<link rel="canonical" href="...">`。
      * **禁止包含** `www`。
      * 页面 URL 可以 `.html` 结尾，但 **canonical 不能以 `.html` 结尾**。
      * 例如：页面 URL 为 `https://ai-photo-prompt.com/en/prompt/portrait-01.html`，则 canonical 应为 `https://ai-photo-prompt.com/en/prompt/portrait-01`。
2.  **Meta Description**: 每个页面 `<meta name="description" content="...">` 需以 **`#1`** 开头。
3.  **Hreflang 标签**: 在所有页面 `<head>` 中正确设置 **`hreflang` 标签**，指向对应的中英文版本，以支持多语言 SEO 规范。
4.  **图片优化**: 每个 `<img>` 标签的 **`alt` 值必须包含关键词**。
5.  **Sitemap**:
      * 所有页面（包括法律页面、Blog、FAQ）都要添加到 **`sitemap.xml`**。
      * `sitemap.xml` **不能以 `.html` 结尾**。
6.  **URL 优化**: URL 必须使用语言前缀（`/en/` 和 `/zh/`），且应包含对应语言的关键词。

## 四、技术实现要求

1.  **渲染模式**: 所有页面均需采用 **服务端渲染 (SSR)**，**禁止使用客户端渲染**。
2.  **框架/样式**:
      * 基础框架：**Next.js (SSR)**。
      * 样式语言：必须使用 **Tailwind CSS**。
3.  **i18n**: 使用 **Next.js 内置 i18n** 实现多语言路由和内容切换。根据语言环境分别加载对应的 JSON 数据文件。
4.  **搜索**: 采用 **FlexSearch** 库实现纯前端高性能搜索，英文环境搜索英文数据，中文环境搜索中文数据。
5.  **Favicon**: 每个页面的 `<head>` 中需添加一行：
    ```html
    <link rel="icon" href="/favicon.ico" type="image/png">
    ```

## 五、内容规范

1.  **语言**: 网站支持 **中英文完整切换**，UI 文本和 Prompt 数据都根据语言环境显示对应版本。
2.  **字数**: 除主页外，其他每个页面的**单词数尽量不低于 600 个**（包括 Detail, Blog, FAQ, Terms, Policy）。
3.  **响应式**: 每个页面需**兼容移动端**。
4.  **图片资源**: 使用 PNG 格式，存放在 public/assets 目录下。
5.  **数据源**: 使用 data 目录下的 4 个 JSON 文件，根据语言环境动态加载。

## 六、开发优先级（已确认）

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

# AI Photo Prompt 项目开发 Todo List

以下是按照模块和优先级划分的具体开发步骤。

## 阶段一：基础架构与环境配置（已完成大部分）

1.  [x] **项目初始化**: 创建 Next.js 项目并配置为 **SSR** 模式。
2.  [x] **样式配置**: 安装并配置 **Tailwind CSS**。
3.  [ ] **i18n 配置**:
      * 修复 `next.config.mjs` 中的配置警告。
      * 创建 `public/locales/en` 和 `public/locales/zh` 翻译文件目录。
      * 配置多语言路由和内容切换。
4.  [ ] **数据处理优化**: 优化数据加载逻辑，根据语言环境分别加载对应的 JSON 文件，解决数据量过大问题。
5.  [x] **布局组件**: 创建基础 Layout 组件，包含页眉 (`<head>`)、导航栏和页脚。

## 阶段二：通用组件与 SEO 实施

1.  [ ] **SEO 组件**: 实现自定义 `<Head>` 组件或利用 Next.js Head，确保所有页面自动设置：
      * **Canonical URL** (去除 `www` 和 `.html` 尾缀)。
      * **Description** (`#1` 开头)。
      * **Hreflang 标签** (指向 `/en/...` 和 `/zh/...` 对应页面)。
      * **Favicon** 标签 (`<link rel="icon" href="/favicon.ico" type="image/png">`)。
2.  [ ] **导航栏 (Navbar) 实现**:
      * 包含 **Home**、**Blog**、**FAQ** 链接。
      * 实现**语言切换按钮**，点击后通过 **Next.js i18n 路由**切换（触发**重新请求**）。
3.  [ ] **页脚 (Footer) 实现**: 包含 **Terms of Service**、**Privacy Policy**、**Contact Us** 链接。
4.  [ ] **图片组件封装**: 封装 Image 组件，确保所有图片：
      * 使用 **PNG** 格式，存放在 public/assets 目录。
      * 强制包含包含**关键词**的 `alt` 属性。
      * 实现 `object-fit: cover` 效果。

## 阶段三：核心页面开发（当前重点）

1.  [ ] **数据类型更新**: 更新 `PromptData` 接口，添加 `outputImages`、`inputImages`、`author`、`authorUrl` 等字段。
2.  [ ] **Prompt Detail Page ([slug].js)**:
      * 利用 **SSR** (`getServerSideProps`) 动态生成详情页。
      * 实现 **2.1 核心信息展示** 布局 (左侧高清图/右侧Prompt和参数)。
      * 实现 **2.2 一键复制** 功能 (仅复制 Prompt 文本)。
      * 页面底部添加相关推荐区块，确保 600+ 单词内容。
3.  [ ] **Home/List Page 优化**:
      * 实现 **规整网格布局**：使用 **Tailwind CSS Grid** 实现响应式 3/4 列布局（参考 example.png）。
      * 更新 **PromptCard 组件**: 显示图片、Prompt 简要 (限制 2 行)、标签、模型、作者信息。
4.  [ ] **搜索/筛选功能优化**:
      * 修改搜索逻辑：英文环境只搜索英文数据，中文环境只搜索中文数据。
      * 实现前端搜索框和筛选器 UI。
      * 集成 **FlexSearch** 逻辑，实现高性能纯前端搜索/筛选。

## 阶段四：内容与辅助页面

1.  [ ] **Blog Page**：创建 Blog 目录页和 5 篇 Blog 文章详情页，主题包括：
      * 提示词的用法指南
      * 提示词生成技巧
      * 提示词搜索方法
      * 模型使用方法对比
      * 对提示词作者的答谢
      确保每篇文章单词数 > 600。
2.  [ ] **FAQ Page**：创建 FAQ 页面，包含联系邮箱信息。确保内容充实，单词数 > 600。
3.  [ ] **Contact Us Page**: 创建独立联系页面，显示 firenull52@gmail.com。
4.  [ ] **Terms of Service Page**: 编写并部署，单词数 > 600，支持中英文切换。
5.  [ ] **Privacy Policy Page**: 编写并部署，单词数 > 600，支持中英文切换。

## 阶段五：发布与优化

1.  [ ] **Sitemap 生成**: 编写脚本或使用 Next.js 插件，生成不含 `.html` 尾缀的 **`sitemap.xml`**，包含所有页面路由。
2.  [ ] **移动端兼容性 (RWD)**: 全面测试和调整所有页面在移动设备上的显示效果。
3.  [ ] **Vercel 部署**: 关联 Git 仓库并配置 **Vercel** 实现自动 CI/CD。
4.  [ ] **最终审查**: 对照全部需求清单进行最终检查，尤其是 SEO 硬性要求。