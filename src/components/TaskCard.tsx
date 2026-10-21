import { memo } from 'react'
import type { Task } from '../types'
import { PRIORITY_META } from '../types'

interface Props {
  task: Task
  onEdit: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}

function TaskCardBase({ task, onEdit, onDragStart, onDragEnd }: Props) {
  const meta = PRIORITY_META[task.priority]

  return (
    <div
      className="card"
      data-task-id={task.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onEdit}
    >
      <div className="card-priority" style={{ background: meta.color, boxShadow: `0 0 12px ${meta.glow}` }} />
      <div className="card-top">
        <div className="card-title">{task.title}</div>
        <button className="card-menu" onClick={(e) => { e.stopPropagation(); onEdit() }} aria-label="编辑">
          ⋯
        </button>
      </div>
      {task.description && <div className="card-desc">{task.description}</div>}
      <div className="card-footer">
        <div className="card-tags">
          {task.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <span className="priority-badge" style={{ color: meta.color }}>{meta.label}</span>
      </div>
    </div>
  )
}

export const TaskCard = memo(TaskCardBase)