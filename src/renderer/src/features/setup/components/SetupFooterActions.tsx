import React from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import type { SetupStep } from '../types'

interface SetupFooterActionsProps {
  currentStep: SetupStep
  isInstalling: boolean
  isComplete: boolean
  onNext: () => void
  onPrevious: () => void
  onExecute: () => void
}

export const SetupFooterActions: React.FC<SetupFooterActionsProps> = ({
  currentStep,
  isInstalling,
  isComplete,
  onNext,
  onPrevious,
  onExecute
}) => {
  if (isComplete) return null

  return (
    <div className="w-full bg-card/60 backdrop-blur-md border-t border-border/60 py-4 px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Previous Button */}
        {currentStep > 1 && currentStep < 6 && (
          <button
            type="button"
            disabled={isInstalling}
            onClick={onPrevious}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold transition-all disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الخطوة السابقة</span>
          </button>
        )}
        {currentStep === 1 && <div />}

        {/* Next / Finish Button */}
        {currentStep < 5 && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:translate-x-[-2px]"
          >
            <span>متابعة للخطوة التالية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {currentStep === 5 && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <span>مراجعة وتأكيد التثبيت</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {currentStep === 6 && (
          <div className="w-full flex justify-end">
            <button
              type="button"
              disabled={isInstalling}
              onClick={onExecute}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-95 text-primary-foreground text-base font-bold shadow-xl shadow-primary/25 transition-all disabled:opacity-50"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تنفيذ التثبيت وقفل النظام...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>بدء التثبيت وتهيئة النظام</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
