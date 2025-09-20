'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, User, BarChart3 } from 'lucide-react'
import PomodoroTimer from '@/components/PomodoroTimer'
import TaskList from '@/components/TaskList'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessionData, setSessionData] = useState({ focusMinutes: 0, cyclesCompleted: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchSessionData()
  }, [session, status, router])

  const fetchSessionData = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessionData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados da sessão:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCycleComplete = async (focusMinutes: number, cycles: number) => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          focusMinutes,
          cyclesCompleted: cycles,
        }),
      })
      
      // Atualizar dados locais
      setSessionData(prev => ({
        focusMinutes: prev.focusMinutes + focusMinutes,
        cyclesCompleted: cycles
      }))
    } catch (error) {
      console.error('Erro ao salvar sessão:', error)
    }
  }

  const handleTaskUpdate = () => {
    // Atualizar dados se necessário
    fetchSessionData()
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Produtividade MVP
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>{session.user?.name}</span>
              </div>
              
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Olá, {session.user?.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vamos ser produtivos hoje! Foque nas suas prioridades e use o Pomodoro.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionData.cyclesCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ciclos Pomodoro
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(sessionData.focusMinutes / 60)}h {sessionData.focusMinutes % 60}m
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tempo focado
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hoje
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pomodoro Timer */}
          <div className="lg:order-2">
            <PomodoroTimer onCycleComplete={handleCycleComplete} />
          </div>

          {/* Tasks */}
          <div className="lg:order-1">
            <TaskList onTaskUpdate={handleTaskUpdate} />
          </div>
        </div>
      </main>
    </div>
  )
}
