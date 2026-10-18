import { useState, useEffect, useRef, useCallback } from 'react'
import type { ActivityTimerPreset } from '../types'

export const DEFAULT_PRESETS: ActivityTimerPreset[] = [
  { id: 'morning_circle', title: 'الحلقة الصباحية', durationMinutes: 15, category: 'circle', icon: 'groups' },
  { id: 'meal_time', title: 'وجبة الإفطار', durationMinutes: 20, category: 'meal', icon: 'restaurant' },
  { id: 'free_play', title: 'اللعب الموجه والأركان', durationMinutes: 25, category: 'play', icon: 'extension' },
  { id: 'nap_time', title: 'القيلولة والاسترخاء', durationMinutes: 30, category: 'nap', icon: 'bedtime' },
  { id: 'clean_up', title: 'الترتيب والتنظيف', durationMinutes: 5, category: 'cleanup', icon: 'cleaning_services' }
]

export function useClassroomTimer() {
  const [activePreset, setActivePreset] = useState<ActivityTimerPreset>(DEFAULT_PRESETS[0])
  const [totalSeconds, setTotalSeconds] = useState(15 * 60)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const timerRef = useRef<any>(null)

  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15)
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.15)
        osc.stop(ctx.currentTime + idx * 0.15 + 0.4)
      })
    } catch {
      // Audio fallback silent
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsRunning(false)
            setIsFinished(true)
            playChime()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, playChime])

  const selectPreset = (preset: ActivityTimerPreset) => {
    setActivePreset(preset)
    const secs = preset.durationMinutes * 60
    setTotalSeconds(secs)
    setSecondsLeft(secs)
    setIsRunning(false)
    setIsFinished(false)
  }

  const setCustomMinutes = (mins: number) => {
    const valid = Math.max(1, Math.min(180, mins))
    const secs = valid * 60
    setActivePreset({
      id: 'custom',
      title: `مؤقت مخصص (${valid} د)`,
      durationMinutes: valid,
      category: 'custom',
      icon: 'timer'
    })
    setTotalSeconds(secs)
    setSecondsLeft(secs)
    setIsRunning(false)
    setIsFinished(false)
  }

  const start = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds)
    }
    setIsFinished(false)
    setIsRunning(true)
  }

  const pause = () => setIsRunning(false)

  const reset = () => {
    setIsRunning(false)
    setIsFinished(false)
    setSecondsLeft(totalSeconds)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = totalSeconds > 0
    ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)
    : 0

  return {
    presets: DEFAULT_PRESETS,
    activePreset,
    totalSeconds,
    secondsLeft,
    isRunning,
    isFinished,
    progressPercent,
    formattedTime: formatTime(secondsLeft),
    selectPreset,
    setCustomMinutes,
    start,
    pause,
    reset
  }
}
