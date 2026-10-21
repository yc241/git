import type { BoardState } from './types'

const now = Date.now()

export const initialBoard: BoardState = {
  columns: [
    {
      id: 'backlog',
      title: '待办',
      accent: 'rgba(99,102,241,0.9)',
      tasks: [
        {
          id: 't1',
          title: '设计落地页 Hero 区域',
          description: '完成首屏视觉稿，包含光晕背景与微边框卡片，需适配深色模式。',
          priority: 'high',
          tags: ['设计', 'UI'],
          createdAt: now - 86400000 * 3,
          order: 0,
        },
        {
          id: 't2',
          title: '编写 API 接口文档',
          description: '梳理用户模块全部 RESTful 接口，输出 OpenAPI 3.0 规范。',
          priority: 'medium',
          tags: ['后端', '文档'],
          createdAt: now - 86400000 * 2,
          order: 1,
        },
        {
          id: 't3',
          title: '修复登录态过期跳转',
          description: 'token 刷新失败后未正确重定向至 /login，需补充 401 拦截逻辑。',
          priority: 'urgent',
          tags: ['Bug', '认证'],
          createdAt: now - 86400000,
          order: 2,
        },
      ],
    },
    {
      id: 'in-progress',
      title: '进行中',
      accent: 'rgba(168,85,247,0.9)',
      tasks: [
        {
          id: 't4',
          title: '看板拖拽交互实现',
          description: '基于 HTML5 DnD 实现跨列拖拽，拖动时卡片缩放与光晕反馈。',
          priority: 'high',
          tags: ['前端', '交互'],
          createdAt: now - 86400000 * 2,
          order: 0,
        },
        {
          id: 't5',
          title: '数据库索引优化',
          description: '对订单表查询热点字段建立复合索引，目标 P95 < 50ms。',
          priority: 'medium',
          tags: ['DB', '性能'],
          createdAt: now - 3600000 * 5,
          order: 1,
        },
      ],
    },
    {
      id: 'review',
      title: '评审中',
      accent: 'rgba(244,114,182,0.9)',
      tasks: [
        {
          id: 't6',
          title: '权限模型重构方案',
          description: '从 RBAC 迁移至 ABAC，评审动态策略引擎的可行性。',
          priority: 'medium',
          tags: ['架构', '安全'],
          createdAt: now - 86400000 * 4,
          order: 0,
        },
      ],
    },
    {
      id: 'done',
      title: '已完成',
      accent: 'rgba(52,211,153,0.9)',
      tasks: [
        {
          id: 't7',
          title: '搭建 CI/CD 流水线',
          description: 'GitHub Actions 自动构建并部署至预览环境，含 Lighthouse 报告。',
          priority: 'low',
          tags: ['DevOps'],
          createdAt: now - 86400000 * 6,
          order: 0,
        },
        {
          id: 't8',
          title: '组件库 Storybook 初始化',
          description: '接入 Storybook 7，完成 Button / Input / Modal 基础文档。',
          priority: 'low',
          tags: ['前端', '工具'],
          createdAt: now - 86400000 * 5,
          order: 1,
        },
      ],
    },
  ],
}