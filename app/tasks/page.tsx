'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/lib/api'
import TaskCard from '@/components/TaskCard'

export default function TasksPage() {
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const { 
    tasks, 
    isLoading, 
    error, 
    completeTask, 
    updateTask, 
    deleteTask 
  } = useTasks({})

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading tasks: {error.message}</p>
      </div>
    )
  }

  const filteredTasks = tasks?.filter((task: Task) => {
    if (filter === 'all') return true
    return task.status === filter
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Link
          href="/tasks/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Link>
      </div>

      <div className="flex space-x-2">
        {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'All' : status === 'todo' ? 'To Do' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filter === 'all' ? 'No tasks yet.' : `No ${filter === 'todo' ? 'to do' : filter.replace('_', ' ')} tasks.`}
          </p>
          <Link
            href="/tasks/new"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task: Task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={completeTask}
              onUpdate={(taskId, updates) => updateTask({ taskId, updates })}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}
