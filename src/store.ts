import type { BoardState, Task } from './types'
import { initialBoard } from './data'

const STORAGE_KEY = 'taskflow-board-v1'

export function loadBoard(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(initialBoard)
    const parsed = JSON.parse(raw) as BoardState
    if (!parsed.columns || !Array.isArray(parsed.columns)) return structuredClone(initialBoard)
    return parsed
  } catch {
    return structuredClone(initialBoard)
  }
}

export function saveBoard(board: BoardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  } catch {
    /* ignore quota errors */
  }
}

export function resetBoard(): BoardState {
  const fresh = structuredClone(initialBoard)
  saveBoard(fresh)
  return fresh
}

export function createTask(partial: Partial<Task>): Task {
  return {
    id: 't_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    title: partial.title ?? '',
    description: partial.description ?? '',
    priority: partial.priority ?? 'medium',
    tags: partial.tags ?? [],
    createdAt: Date.now(),
    order: partial.order ?? 0,
  }
}