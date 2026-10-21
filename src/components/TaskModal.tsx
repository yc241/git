import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Task, Priority } from '../types'
import { PRIORITY_META } from '../types'

interface Props {
  task: Task | null
  onSave: (data: { title: string; description: string; priority: Priority; tags: string[] }) => void
  onDelete: (() => void) | null
  onClose: () => void
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']

export function TaskModal({ task, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [tags, setTags] = useState<string[]>(task?.tags ?? [])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const addTag = () => {
    const v = tagInput.trim()
    if (v && !tags.includes(v)) setTags([...tags, v])
    setTagInput('')
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), priority, tags })
  }

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <div className="modal-header">
          <div className="modal-title">{task ? '编辑任务' : '新建任务'}</div>
          <button className="modal-close" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className="field">
          <label className="field-label">标题</label>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入任务标题…"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="field">
          <label className="field-label">描述</label>
          <textarea
            className="field-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="补充任务详情…"
          />
        </div>

        <div className="field">
          <label className="field-label">优先级</label>
          <div className="priority-grid">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                className={`priority-opt ${priority === p ? 'active' : ''}`}
                style={{ color: PRIORITY_META[p].color }}
                onClick={() => setPriority(p)}
              >
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">标签</label>
          <div className="tags-input">
            {tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label="移除标签">×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addTag()
                }
              }}
              onBlur={addTag}
              placeholder={tags.length ? '' : '输入标签后回车…'}
            />
          </div>
        </div>

        <div className="modal-footer">
          {onDelete && (
            <button className="btn-danger" onClick={onDelete}>删除</button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!title.trim()}>
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}