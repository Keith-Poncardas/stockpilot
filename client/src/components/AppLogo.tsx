import { Activity } from 'lucide-react'

type LogoSize = 'sm' | 'md'

const sizeMap: Record<LogoSize, { box: string; icon: number; text: string }> = {
    sm: { box: 'w-7 h-7', icon: 14, text: 'text-lg' },
    md: { box: 'w-7 h-7', icon: 16, text: 'text-[16px]' },
}

interface AppLogoProps {
    size?: LogoSize
    /** Override the brand-name text colour (default: inherits) */
    textClass?: string
}

function AppLogo({ size = 'md', textClass = 'font-bold' }: AppLogoProps) {
    const s = sizeMap[size]
    return (
        <div className="flex items-center gap-2.5">
            <div className={`${s.box} bg-amber-400 rounded-md flex items-center justify-center shrink-0`}>
                <Activity size={s.icon} strokeWidth={2.5} color="#000" />
            </div>
            <span className={`${s.text} ${textClass} tracking-tight`}>StockPilot</span>
        </div>
    )
}

export default AppLogo
