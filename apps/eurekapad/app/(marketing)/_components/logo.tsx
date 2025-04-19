import { Poppins } from 'next/font/google'
import Image from 'next/image'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const Logo = ({ className, darkMode }: { className?: string; darkMode?: boolean }) => {
  return (
    <div className={cn('hidden md:flex items-center gap-x-2', className)}>
      {darkMode === null && (
        <>
          <Image src="/logo.svg" height="40" width="40" alt="Logo" className="dark:hidden" />
          <Image src="/logo-dark.svg" height="40" width="40" alt="Logo" className="hidden dark:block" />
        </>
      )}

      {darkMode ? (
        <Image src="/logo-dark.svg" height="40" width="40" alt="Logo" />
      ) : (
        <Image src="/logo.svg" height="40" width="40" alt="Logo" />
      )}

      <p className={cn('font-semibold', font.className, darkMode ? '' : 'text-slate-900')}>EurekaPad</p>
    </div>
  )
}
