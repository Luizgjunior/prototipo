'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface PomodoroTimerProps {
  onCycleComplete: (focusMinutes: number, cycles: number) => void
}

type TimerMode = 'focus' | 'break'

export default function PomodoroTimer({ onCycleComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('focus')
  const [cycles, setCycles] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const focusTime = 25 * 60 // 25 minutos
  const breakTime = 5 * 60 // 5 minutos

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer acabou
            if (mode === 'focus') {
              // Ciclo de foco completo
              const newCycles = cycles + 1
              const newFocusTime = totalFocusTime + focusTime
              setCycles(newCycles)
              setTotalFocusTime(newFocusTime)
              onCycleComplete(focusTime, newCycles)
              
              // Mudar para pausa
              setMode('break')
              return breakTime
            } else {
              // Pausa completa, voltar para foco
              setMode('focus')
              return focusTime
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode, cycles, totalFocusTime, focusTime, breakTime, onCycleComplete])

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setMode('focus')
    setTimeLeft(focusTime)
    setCycles(0)
    setTotalFocusTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = mode === 'focus' 
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100

  return (
    <div className="card text-center">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Pomodoro Timer
        </h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'focus' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          }`}>
            {mode === 'focus' ? 'Foco' : 'Pausa'}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Ciclos: {cycles}
          </span>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className={mode === 'focus' ? 'text-red-500' : 'text-green-500'}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="btn-primary flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="btn-secondary flex items-center gap-2"
          >
            <Pause className="h-4 w-4" />
            Pausar
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Resetar
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">Tempo focado</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {Math.floor(totalFocusTime / 60)}min
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Ciclos hoje</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {cycles}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
