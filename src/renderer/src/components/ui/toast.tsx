import * as React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning'

interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  open?: boolean
}

type ToastAction = (item: ToastItem) => void

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ActionType = 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST'

interface State {
  toasts: ToastItem[]
}

type Action = {
  type: ActionType
  toast?: ToastItem
  toastId?: string
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toastId ? { ...t, ...action.toast } : t)),
      }
    case 'DISMISS_TOAST': {
      const { toastId } = action
      if (!toastId) return { ...state, toasts: [] }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { ...state, toasts: [] }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

type Toast = Omit<ToastItem, 'id'>

function toast({ ...props }: Toast) {
  const id = Math.random().toString(36).slice(2, 9)
  const update = (props: ToastItem) => dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id }, toastId: id })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id, open: true } })

  return {
    id,
    dismiss,
    update,
  }
}

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<State>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ state, dispatch, toast }}>
      {children}
      <div
        className={cn(
          'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-4 sm:right-4 sm:flex-col sm:max-w-[420px]'
        )}
      >
        {state.toasts.map(({ id, ...props }) => {
          const key = `toast-${id}`
          const variantClass = cn(
            'rounded-lg border p-4 shadow-lg',
            props.variant === 'destructive' && 'border-destructive bg-destructive text-destructive-foreground',
            props.variant === 'success' && 'border-success bg-success text-success-foreground',
            props.variant === 'warning' && 'border-warning bg-warning text-warning-foreground',
            !props.variant && 'border-input bg-background text-foreground'
          )

          return (
            <ToastItem
              key={key}
              id={id}
              variant={props.variant}
              title={props.title}
              description={props.description}
              variantClass={variantClass}
            />
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

const ToastContext = createContext<{ state: State; dispatch: (action: Action) => void; toast: typeof toast } | null>(null)

const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      state: memoryState,
      dispatch,
      toast
    }
  }
  return context
}

const ToastItem = ({ id, variant, title, description, variantClass }: ToastItem & { variantClass: string }) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!open) return null

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(variantClass, 'opacity-100 transition-opacity')}
      >
        {title && <h4 className="font-semibold">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    </div>
  )
}

export { useToast, ToastProvider, toast }
