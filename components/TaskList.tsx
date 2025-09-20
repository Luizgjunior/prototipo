'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Star, CheckCircle, Circle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: string
  title: string
  status: 'TODO' | 'DOING' | 'DONE'
  isPriority: boolean
  createdAt: string
}

interface TaskListProps {
  onTaskUpdate: () => void
}

export default function TaskList({ onTaskUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isPriority, setIsPriority] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          isPriority,
        }),
      })

      if (response.ok) {
        setNewTaskTitle('')
        setIsPriority(false)
        fetchTasks()
        onTaskUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar tarefa')
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      alert('Erro ao criar tarefa')
    }
  }

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchTasks()
        onTaskUpdate()
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const togglePriority = async (taskId: string, currentPriority: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPriority: !currentPriority }),
      })

      if (response.ok) {
        fetchTasks()
        onTaskUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar prioridade')
      }
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTasks()
        onTaskUpdate()
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return <Circle className="h-5 w-5 text-gray-400" />
      case 'DOING':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'DONE':
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return 'text-gray-600 dark:text-gray-400'
      case 'DOING':
        return 'text-blue-600 dark:text-blue-400'
      case 'DONE':
        return 'text-green-600 dark:text-green-400 line-through'
    }
  }

  const priorityTasks = tasks.filter(task => task.isPriority && task.status !== 'DONE')
  const regularTasks = tasks.filter(task => !task.isPriority && task.status !== 'DONE')
  const completedTasks = tasks.filter(task => task.status === 'DONE')

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nova Tarefa
        </h3>
        <form onSubmit={addTask} className="space-y-4">
          <div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Digite sua tarefa..."
              className="input-field"
              maxLength={100}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                disabled={priorityTasks.length >= 3}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Prioridade do dia {priorityTasks.length >= 3 && '(máx 3)'}
              </span>
            </label>
            <button
              type="submit"
              disabled={!newTaskTitle.trim() || (isPriority && priorityTasks.length >= 3)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </form>
      </div>

      {/* Priority Tasks */}
      {priorityTasks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Prioridades do Dia ({priorityTasks.length}/3)
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {priorityTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <button
                    onClick={() => updateTaskStatus(task.id, task.status === 'TODO' ? 'DOING' : task.status === 'DOING' ? 'DONE' : 'TODO')}
                    className="flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <span className={`flex-1 ${getStatusColor(task.status)}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePriority(task.id, task.isPriority)}
                      className="p-1 text-yellow-500 hover:text-yellow-600"
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular Tasks */}
      {regularTasks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Outras Tarefas
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {regularTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <button
                    onClick={() => updateTaskStatus(task.id, task.status === 'TODO' ? 'DOING' : task.status === 'DOING' ? 'DONE' : 'TODO')}
                    className="flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <span className={`flex-1 ${getStatusColor(task.status)}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePriority(task.id, task.isPriority)}
                      className="p-1 text-gray-400 hover:text-yellow-500"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Concluídas ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {completedTasks.slice(0, 5).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3 p-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="flex-1 text-gray-500 dark:text-gray-400 line-through">
                    {task.title}
                  </span>
                  {task.isPriority && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {completedTasks.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                +{completedTasks.length - 5} tarefas concluídas
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <CheckCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma tarefa ainda
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione sua primeira tarefa para começar a ser produtivo!
          </p>
        </div>
      )}
    </div>
  )
}
