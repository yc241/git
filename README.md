# Taskflow · 任务管理看板

一个基于 React + TypeScript + Vite 构建的现代化任务管理看板（Kanban Board）应用，采用 Linear Aesthetic 深色设计风格。

## 功能特性

- **四列看板**：待办 / 进行中 / 评审中 / 已完成，支持跨列拖拽并按鼠标位置精确插入
- **任务管理**：新建、编辑、删除任务，支持标题、描述、优先级（低/中/高/紧急）、标签
- **拖拽交互**：基于 HTML5 Drag & Drop，卡片悬浮光晕与缩放反馈
- **搜索过滤**：按标题、描述、标签实时搜索
- **数据持久化**：localStorage 自动保存，支持一键重置
- **统计概览**：实时展示全部、未完成、进行中、已完成数量

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite 5
- **动画**：Framer Motion
- **设计**：Linear Aesthetic（深色主题、微边框、玻璃态、光晕、shimmer 动画）

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 http://127.0.0.1:5173/

## 项目结构

```
task-board/
├── src/
│   ├── components/
│   │   ├── Column.tsx      # 看板列
│   │   ├── TaskCard.tsx    # 任务卡片
│   │   └── TaskModal.tsx   # 编辑弹窗
│   ├── App.tsx             # 主应用（状态管理 + 拖拽）
│   ├── types.ts            # 类型定义
│   ├── store.ts            # localStorage 持久化
│   ├── data.ts             # 初始数据
│   └── index.css           # 全局样式
├── index.html
└── package.json
```