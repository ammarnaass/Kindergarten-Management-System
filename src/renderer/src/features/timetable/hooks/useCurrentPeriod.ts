import { useState, useEffect, useMemo, useCallback } from 'react'
import type { TimetablePeriod, CurrentPeriodStatus } from '../types'

function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function playTransitionChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)

      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    // Play a gentle two-tone chime (F5 -> A5)
    playTone(698.46, 0, 0.45)
    playTone(880.0, 0.25, 0.7)
  } catch {}
}

export function useCurrentPeriod(periods: TimetablePeriod[]) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentMinutes = useMemo(() => {
    return now.getHours() * 60 + now.getMinutes()
  }, [now])

  const currentTimeFormatted = useMemo(() => {
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  }, [now])

  const status = useMemo<CurrentPeriodStatus>(() => {
    if (!periods || periods.length === 0) {
      return {
        currentPeriod: null,
        nextPeriod: null,
        minutesRemaining: 0,
        progressPercent: 0,
        isSchoolHours: false,
        statusText: 'لم يتم تحميل فترات الجدول بعد'
      }
    }

    const sorted = [...periods].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
    const firstPeriod = sorted[0]
    const lastPeriod = sorted[sorted.length - 1]

    const dayStartMins = timeToMinutes(firstPeriod.startTime)
    const dayEndMins = timeToMinutes(lastPeriod.endTime)

    // 1. Before school day begins
    if (currentMinutes < dayStartMins) {
      const diff = dayStartMins - currentMinutes
      return {
        currentPeriod: null,
        nextPeriod: firstPeriod,
        minutesRemaining: diff,
        progressPercent: 0,
        isSchoolHours: false,
        statusText: `قبل بدء اليوم الدراسي — الاستقبال يبدأ بعد ${diff} دقيقة (${firstPeriod.startTime})`
      }
    }

    // 2. After school day ends
    if (currentMinutes >= dayEndMins) {
      return {
        currentPeriod: null,
        nextPeriod: null,
        minutesRemaining: 0,
        progressPercent: 100,
        isSchoolHours: false,
        statusText: `انتهى الدوام الرسمي لليوم الدراسي (تم الانصراف الساعة ${lastPeriod.endTime})`
      }
    }

    // 3. During school hours: find active period
    let active: TimetablePeriod | null = null
    let next: TimetablePeriod | null = null

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i]
      const startMins = timeToMinutes(p.startTime)
      const endMins = timeToMinutes(p.endTime)

      if (currentMinutes >= startMins && currentMinutes < endMins) {
        active = p
        next = sorted[i + 1] || null
        break
      }
    }

    // If between periods (break / transition gap)
    if (!active) {
      next = sorted.find((p) => timeToMinutes(p.startTime) > currentMinutes) || null
      const diffToNext = next ? timeToMinutes(next.startTime) - currentMinutes : 0
      return {
        currentPeriod: null,
        nextPeriod: next,
        minutesRemaining: diffToNext,
        progressPercent: 100,
        isSchoolHours: true,
        statusText: `فترة استراحة وانتقال — الفترة التالية تبدأ بعد ${diffToNext} دقيقة`
      }
    }

    const startM = timeToMinutes(active.startTime)
    const endM = timeToMinutes(active.endTime)
    const duration = Math.max(1, endM - startM)
    const elapsed = currentMinutes - startM
    const remaining = Math.max(0, endM - currentMinutes)
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)))

    return {
      currentPeriod: active,
      nextPeriod: next,
      minutesRemaining: remaining,
      progressPercent: progress,
      isSchoolHours: true,
      statusText: remaining === 0 ? 'انتهت الفترة الآن' : `متبقي ${remaining} دقيقة على انتهاء الفترة`
    }
  }, [periods, currentMinutes])

  const triggerChime = useCallback(() => {
    playTransitionChime()
  }, [])

  return {
    ...status,
    currentTimeFormatted,
    triggerChime
  }
}
