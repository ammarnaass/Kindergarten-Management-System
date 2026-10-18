import React from 'react'
import {
  ShieldCheck,
  Building2,
  UserCheck,
  GraduationCap,
  Printer,
  Sparkles,
  Check
} from 'lucide-react'
import type { SetupStep } from '../types'
import { STEPS_META } from '../constants'

interface SetupHeaderStepperProps {
  currentStep: SetupStep
}

const ICONS_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  Building2,
  UserCheck,
  GraduationCap,
  Printer,
  Sparkles
}

export const SetupHeaderStepper: React.FC<SetupHeaderStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full bg-card/60 backdrop-blur-md border-b border-border/60 py-4 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-muted rounded-full z-0" />
          <div
            className="absolute top-1/2 right-4 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 z-0"
            style={{
              width: `${((currentStep - 1) / (STEPS_META.length - 1)) * 96}%`
            }}
          />

          {STEPS_META.map((meta) => {
            const isCompleted = meta.step < currentStep
            const isCurrent = meta.step === currentStep
            const Icon = ICONS_MAP[meta.iconName] || ShieldCheck

            return (
              <div key={meta.step} className="flex flex-col items-center relative z-10 group">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground scale-100 ring-4 ring-primary/20'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/30 shadow-primary/25'
                        : 'bg-card text-muted-foreground border border-border/80'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="text-center mt-2 hidden sm:block">
                  <div
                    className={`text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {meta.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5 max-w-[90px] truncate">
                    {meta.subtitle}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
