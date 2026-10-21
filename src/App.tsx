import { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { BoardState, Task, Priority } from './types'
import { loadBoard, saveBoard, resetBoard, createTask } from './store'
import { Column } from './components/Column'
import { TaskModal } from './components/TaskModal'

interface ModalState {
  open: boolean
  task: Task | null
  columnId: string | null
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(loadBoard)
  const [search, setSearch] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragSourceCol, setDragSourceCol] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>({ open: false, task: null, columnId: null })

  useEffect(() => {
    saveBoard(board)
  }, [board])

  const moveTask = useCallback(
    (taskId: string, fromCol: string, toCol: string, insertIndex: number) => {
      setBoard((prev) => {
        const next: BoardState = { columns: prev.columns.map((c) => ({ ...c, tasks: [...c.tasks] })) }
        const src = next.columns.find((c) => c.id === fromCol)
        const dst = next.columns.find((c) => c.id === toCol)
        if (!src || !dst) return prev
        const idx = src.tasks.findIndex((t) => t.id === taskId)
        if (idx === -1) return prev
        const [moved] = src.tasks.splice(idx, 1)
        const realIndex = Math.max(0, Math.min(insertIndex, dst.tasks.length))
        dst.tasks.splice(realIndex, 0, moved)
        src.tasks.forEach((t, i) => (t.order = i))
        dst.tasks.forEach((t, i) => (t.order = i))
        return next
      })
    },
    [],
  )

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string, colId: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
    setDraggingId(taskId)
    setDragSourceCol(colId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggingId(null)
    setDragSourceCol(null)
    setDragOverCol(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, colId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverCol !== colId) setDragOverCol(colId)
  }, [dragOverCol])

  const handleDragLeave = useCallback(() => {
    setDragOverCol(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, toCol: string) => {
      e.preventDefault()
      const taskId = draggingId
      const fromCol = dragSourceCol
      setDragOverCol(null)
      setDraggingId(null)
      setDragSourceCol(null)
      if (!taskId || !fromCol) return

      const colEl = e.currentTarget as HTMLElement
      const cards = Array.from(colEl.querySelectorAll('[data-task-id]')) as HTMLElement[]
      let insertIndex = cards.length
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].dataset.taskId === taskId) continue
        const rect = cards[i].getBoundingClientRect()
        if (e.clientY < rect.top + rect.height / 2) {
          insertIndex = i
          break
        }
      }
      moveTask(taskId, fromCol, toCol, insertIndex)
    },
    [draggingId, dragSourceCol, moveTask],
  )

  const openNew = useCallback((columnId: string) => {
    setModal({ open: true, task: null, columnId })
  }, [])

  const openEdit = useCallback((taskId: string) => {
    for (const col of board.columns) {
      const t = col.tasks.find((x) => x.id === taskId)
      if (t) {
        setModal({ open: true, task: t, columnId: col.id })
        return
      }
    }
  }, [board])

  const handleSave = useCallback(
    (data: { title: string; description: string; priority: Priority; tags: string[] }) => {
      if (!modal.columnId) return
      const colId = modal.columnId
      setBoard((prev) => {
        const next: BoardState = { columns: prev.columns.map((c) => ({ ...c, tasks: [...c.tasks] })) }
        const col = next.columns.find((c) => c.id === colId)
        if (!col) return prev
        if (modal.task) {
          const t = col.tasks.find((x) => x.id === modal.task!.id)
          if (t) {
            t.title = data.title
            t.description = data.description
            t.priority = data.priority
            t.tags = data.tags
          }
        } else {
          col.tasks.push(createTask({ ...data, order: col.tasks.length }))
        }
        return next
      })
      setModal({ open: false, task: null, columnId: null })
    },
    [modal],
  )

  const handleDelete = useCallback(() => {
    if (!modal.task) return
    const id = modal.task.id
    setBoard((prev) => ({
      columns: prev.columns.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== id) })),
    }))
    setModal({ open: false, task: null, columnId: null })
  }, [modal])

  const quickDelete = useCallback((id: string) => {
    setBoard((prev) => ({
      columns: prev.columns.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== id) })),
    }))
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('确定重置看板至初始状态？当前数据将丢失。')) {
      setBoard(resetBoard())
    }
  }, [])

  const filteredBoard = useMemo(() => {
    if (!search.trim()) return board
    const q = search.trim().toLowerCase()
    return {
      columns: board.columns.map((c) => ({
        ...c,
        tasks: c.tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q)),
        ),
      })),
    }
  }, [board, search])

  const stats = useMemo(() => {
    const all = board.columns.flatMap((c) => c.tasks)
    const done = board.columns.find((c) => c.id === 'done')?.tasks.length ?? 0
    const inProg = board.columns.find((c) => c.id === 'in-progress')?.tasks.length ?? 0
    return { total: all.length, done, inProg, open: all.length - done }
  }, [board])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div className="brand-text">
            <span className="brand-name">Taskflow</span>
            <span className="brand-sub">任务看板</span>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="search">
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索任务、标签…"
            />
          </div>
          <button className="btn btn-ghost" onClick={handleReset}>重置</button>
          <button
            className="btn btn-primary"
            onClick={() => openNew(board.columns[0].id)}
          >
            + 新建任务
          </button>
        </div>
      </header>

      <div className="stats">
        <span className="stat"><b>{stats.total}</b> 全部</span>
        <span className="stat"><b>{stats.open}</b> 未完成</span>
        <span className="stat"><b>{stats.inProg}</b> 进行中</span>
        <span className="stat"><b>{stats.done}</b> 已完成</span>
      </div>

      <main className="board">
        {filteredBoard.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            draggingId={draggingId}
            isDragOver={dragOverCol === col.id}
            onAddTask={() => openNew(col.id)}
            onEditTask={openEdit}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}
      </main>

      <AnimatePresence>
        {modal.open && (
          <TaskModal
            task={modal.task}
            onSave={handleSave}
            onDelete={modal.task ? handleDelete : null}
            onClose={() => setModal({ open: false, task: null, columnId: null })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}