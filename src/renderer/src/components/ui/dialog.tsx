import * as React from 'react'
import { cn } from '@/lib/utils'

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  if (!mounted && !open) return null

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center', !open && 'hidden')}
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      <div className="relative w-full max-w-lg rounded-xl border bg-card text-card-foreground shadow-lg p-6 mx-4">
        {children}
      </div>
    </div>
  )
}

export interface DialogTriggerProps {
  children: React.ReactElement
}

export const DialogTrigger = ({ children }: DialogTriggerProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        className="cursor-pointer"
      >
        {children}
      </span>
    </Dialog>
  )
}

export interface DialogContentProps extends DialogProps {
  title?: string
  description?: string
  onClose?: () => void
}

export const DialogContent = ({ title, description, children, onClose, ...dialogProps }: DialogContentProps) => (
  <Dialog {...dialogProps}>
    {title && (
      <div className="flex flex-col space-y-1.5 text-sm text-muted-foreground sm:space-y-0 sm:flex-row">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    )}
    <div className="mt-4">{children}</div>
  </Dialog>
)
