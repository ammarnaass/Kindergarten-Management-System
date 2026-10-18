import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface DisplayZoomContextValue {
  zoomLevel: number
  setZoomLevel: (level: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  availableZoomLevels: number[]
}

const DisplayZoomContext = createContext<DisplayZoomContextValue | null>(null)

export const AVAILABLE_ZOOM_LEVELS = [75, 85, 90, 100, 110, 125, 150]

export function DisplayZoomProvider({ children }: { children: React.ReactNode }) {
  const [zoomLevel, setZoomLevelState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rawdati.zoomLevel')
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= 50 && parsed <= 200) {
          return parsed
        }
      }
    }
    return 100
  })

  const applyZoom = useCallback((level: number) => {
    const root = document.documentElement
    ;(root.style as any).zoom = `${level}%`
  }, [])

  const setZoomLevel = useCallback(
    (level: number) => {
      const clamped = Math.max(50, Math.min(200, level))
      setZoomLevelState(clamped)
      localStorage.setItem('rawdati.zoomLevel', String(clamped))
      applyZoom(clamped)
    },
    [applyZoom]
  )

  const zoomIn = useCallback(() => {
    setZoomLevelState((prev) => {
      const nextIndex = AVAILABLE_ZOOM_LEVELS.findIndex((lvl) => lvl > prev)
      const next = nextIndex !== -1 ? AVAILABLE_ZOOM_LEVELS[nextIndex] : Math.min(200, prev + 10)
      localStorage.setItem('rawdati.zoomLevel', String(next))
      applyZoom(next)
      return next
    })
  }, [applyZoom])

  const zoomOut = useCallback(() => {
    setZoomLevelState((prev) => {
      const reversed = [...AVAILABLE_ZOOM_LEVELS].reverse()
      const prevLvl = reversed.find((lvl) => lvl < prev)
      const next = prevLvl !== undefined ? prevLvl : Math.max(50, prev - 10)
      localStorage.setItem('rawdati.zoomLevel', String(next))
      applyZoom(next)
      return next
    })
  }, [applyZoom])

  const resetZoom = useCallback(() => {
    setZoomLevel(100)
  }, [setZoomLevel])

  // Apply on initial mount
  useEffect(() => {
    applyZoom(zoomLevel)
  }, [applyZoom, zoomLevel])

  // Global keyboard shortcuts and wheel zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault()
          zoomIn()
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          zoomOut()
        } else if (e.key === '0') {
          e.preventDefault()
          resetZoom()
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          zoomIn()
        } else if (e.deltaY > 0) {
          zoomOut()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [zoomIn, zoomOut, resetZoom])

  return (
    <DisplayZoomContext.Provider
      value={{
        zoomLevel,
        setZoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        availableZoomLevels: AVAILABLE_ZOOM_LEVELS,
      }}
    >
      {children}
    </DisplayZoomContext.Provider>
  )
}

export function useDisplayZoom() {
  const ctx = useContext(DisplayZoomContext)
  if (!ctx) {
    throw new Error('useDisplayZoom must be used within a DisplayZoomProvider')
  }
  return ctx
}
