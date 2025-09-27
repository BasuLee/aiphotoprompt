# Repository Guidelines

## 项目结构与模块组织
- 仓库当前仅包含演示资源 `example.png`，新增功能前请先建立 `src/`、`public/`、`tests/` 基础目录。
- 前端页面与业务逻辑放在 `src/` 下的 `app/`、`components/`、`lib/`，公共静态资源统一放入 `public/`，训练或示例数据置于 `data/`。
- 复用 AI 提示相关文档时请放入 `docs/prompts/`，确保文件命名为小写短划线风格以便快速检索。

## 构建、测试与开发命令
- `npm install`：首次拉取后安装依赖，若使用 `pnpm` 或 `yarn` 请保持锁文件一致并更新指南。
- `npm run dev`：启动本地开发服务，默认监听 `localhost:3000`，建议配合浏览器无痕窗口自测提示生效情况。
- `npm run build`：执行生产构建，CI 将依赖该命令验证可部署性，若构建产物需要额外处理请在脚本中封装。
- `npm run test`：运行单元与组件测试，失败时请附带失败截图或日志。

## 代码风格与命名约定
- 统一使用 TypeScript，文件扩展名为 `.ts` / `.tsx`，两空格缩进，行宽 100 字符。
- 建议在仓库根目录维护 `eslint.config.js`，配合 Prettier 自动格式化，提交前运行 `npm run lint` 与 `npm run format`。
- 组件命名采用帕斯卡命名，工具函数使用小驼峰；提示模板文件使用小写短划线，如 `portrait-soft-light.md`。

## 测试规范
- 约定使用 Vitest + Testing Library；测试文件命名为 `*.spec.ts(x)` 并与源码同级。
- 新增功能需覆盖核心业务路径，目标语句覆盖率 ≥80%，通过 `npm run test -- --coverage` 输出报告。
- 对话流程或提示模板变更请附加快照测试或黄金样例说明，以便审阅者复验。

## 提交与 Pull Request 指南
- 采用 Conventional Commits 风格，如 `feat(prompt): support soft light preset`，保证主题句使用中文或英文的祈使语。
- 提交前执行 `npm run lint && npm run test` 并确认工作区整洁。
- PR 描述需包含变更概述、测试结果、潜在风险与回滚策略；涉及视觉更新时附上 `public/` 截图对比。

## 安全与配置提示
- 切勿提交 API Key 或私有模型配置，使用 `.env.example` 提示占位变量并更新 README。
- 生产环境域名、存储桶等敏感信息需通过 CI 密钥管理注入，避免硬编码。
