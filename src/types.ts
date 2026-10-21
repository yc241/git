export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  tags: string[]
  createdAt: number
  order: number
}

export interface Column {
  id: string
  title: string
  accent: string
  tasks: Task[]
}

export interface BoardState {
  columns: Column[]
}

export const PRIORITY_META: Record<Priority, { label: string; color: string; glow: string }> = {
  low: { label: '低', color: '#71717A', glow: 'rgba(113,113,122,0.35)' },
  medium: { label: '中', color: '#3B82F6', glow: 'rgba(59,130,246,0.35)' },
  high: { label: '高', color: '#F59E0B', glow: 'rgba(245,158,11,0.35)' },
  urgent: { label: '紧急', color: '#EF4444', glow: 'rgba(239,68,68,0.45)' },
}