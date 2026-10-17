import React, { useState, useRef, useEffect } from 'react'

interface PinKeypadProps {
  pin: string
  onChange: (pin: string) => void
  onSubmit: () => void
  disabled?: boolean
  maxDigits?: number
}

export const PinKeypad: React.FC<PinKeypadProps> = ({
  pin,
  onChange,
  onSubmit,
  disabled = false,
  maxDigits = 6
}) => {
  const [showDigits, setShowDigits] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyPress = (digit: string) => {
    if (disabled || pin.length >= maxDigits) return
    const nextPin = pin + digit
    onChange(nextPin)
    if (nextPin.length === maxDigits || (nextPin.length === 4 && maxDigits === 4)) {
      // Small timeout for user visual feedback
      setTimeout(() => onSubmit(), 150)
    }
  }

  const handleBackspace = () => {
    if (disabled || pin.length === 0) return
    onChange(pin.slice(0, -1))
  }

  const handleClear = () => {
    if (disabled) return
    onChange('')
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, maxDigits)
    onChange(clean)
    if (clean.length === maxDigits) {
      setTimeout(() => onSubmit(), 150)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (pin.length >= 4) {
        onSubmit()
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Visual Digits Slots ────────────────────────── */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex items-center justify-center gap-2.5 py-2 cursor-pointer select-none"
      >
        {Array.from({ length: maxDigits }).map((_, index) => {
          const isFilled = index < pin.length
          const isCurrent = index === pin.length
          return (
            <div
              key={index}
              className={`w-12 h-14 rounded-xl flex items-center justify-center font-bold text-headline-lg transition-all duration-150 border-2 ${
                isFilled
                  ? 'bg-primary/10 border-primary text-primary shadow-xs'
                  : isCurrent
                  ? 'bg-surface-container-high border-outline text-on-surface shadow-inner'
                  : 'bg-surface-container border-outline-variant/40 text-on-surface-variant'
              }`}
            >
              {isFilled ? (showDigits ? pin[index] : '●') : '-'}
            </div>
          )
        })}
      </div>

      {/* ── Hidden / Direct Keyboard Input with Eye Toggle ── */}
      <div className="relative">
        <input
          ref={inputRef}
          type={showDigits ? 'text' : 'password'}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxDigits}
          value={pin}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="انقر هنا واكتب الأرقام مباشرة..."
          className="w-full h-11 bg-surface-container px-4 rounded-xl text-center font-mono tracking-widest text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/40 transition-colors"
        />
        <button
          type="button"
          onClick={() => {
            setShowDigits(!showDigits)
            inputRef.current?.focus()
          }}
          title={showDigits ? 'إخفاء الأرقام' : 'إظهار الأرقام'}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showDigits ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {/* ── Mini Desktop Numpad ─────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto w-full pt-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyPress(digit)}
            className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-on-surface font-bold text-headline-sm transition-all shadow-xs flex items-center justify-center border border-outline-variant/20 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={handleClear}
          className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high active:scale-95 text-error font-bold text-label-md transition-all shadow-xs flex items-center justify-center border border-outline-variant/20 disabled:opacity-50"
        >
          مسح
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeyPress('0')}
          className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-on-surface font-bold text-headline-sm transition-all shadow-xs flex items-center justify-center border border-outline-variant/20 disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleBackspace}
          title="تراجع"
          className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high active:scale-95 text-on-surface-variant hover:text-on-surface transition-all shadow-xs flex items-center justify-center border border-outline-variant/20 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">backspace</span>
        </button>
      </div>
    </div>
  )
}
