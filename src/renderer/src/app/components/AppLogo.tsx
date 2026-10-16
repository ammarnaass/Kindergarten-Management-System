import logoImg from '../../assets/app-logo.png'
import iconImg from '../../assets/app-icon.png'

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  subtitle?: string
  iconOnly?: boolean
  className?: string
}

export function AppLogo({
  size = 'md',
  showText = true,
  subtitle = 'فرع الياسمين النموذجي',
  iconOnly = false,
  className = ''
}: AppLogoProps) {
  const sizeMap = {
    xs: { icon: 'w-6 h-6 rounded-md', title: 'text-sm font-bold', sub: 'text-[10px]' },
    sm: { icon: 'w-8 h-8 rounded-lg', title: 'text-base font-bold', sub: 'text-xs' },
    md: { icon: 'w-10 h-10 rounded-xl', title: 'text-lg font-bold', sub: 'text-xs' },
    lg: { icon: 'w-14 h-14 rounded-2xl', title: 'text-2xl font-bold', sub: 'text-sm' },
    xl: { icon: 'w-20 h-20 rounded-3xl', title: 'text-3xl font-extrabold', sub: 'text-base' }
  }

  const currentSize = sizeMap[size]

  return (
    <div className={`flex items-center gap-space-sm select-none ${className}`}>
      <div className={`relative shrink-0 overflow-hidden shadow-xs ring-2 ring-primary/20 bg-surface-container-lowest ${currentSize.icon}`}>
        <img
          src={iconOnly ? iconImg : logoImg}
          alt="شعار روضتي"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
        />
      </div>

      {showText && !iconOnly && (
        <div className="leading-tight flex flex-col justify-center">
          <span className={`text-primary font-bold tracking-tight ${currentSize.title}`}>
            روضتي
          </span>
          {subtitle && (
            <span className={`text-on-surface-variant font-medium ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
