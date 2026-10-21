import { memo } from 'react'
import type { Column as ColumnType } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
  column: ColumnType
  draggingId: string | null
  isDragOver: boolean
  onAddTask: () => void
  onEditTask: (taskId: string) => void
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, columnId: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, columnId: string) => void
}

function ColumnBase({
  column,
  draggingId,
  isDragOver,
  onAddTask,
  onEditTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: Props) {
  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" style={{ color: column.accent, background: column.accent }} />
          {column.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="column-count">{column.tasks.length}</span>
          <button className="column-add" onClick={onAddTask} aria-label="新建任务">+</button>
        </div>
      </div>
      <div className="column-body">
        {column.tasks.length === 0 && (
          <div className="empty-hint">拖拽任务到此处</div>
        )}
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task.id)}
            onDragStart={(e) => onDragStart(e, task.id, column.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

export const Column = memo(ColumnBase)