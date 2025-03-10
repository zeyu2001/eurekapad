import { cva, type VariantProps } from 'class-variance-authority'
import { Loader } from 'lucide-react'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      default: 'size-4',
      sm: 'size-2',
      lg: 'size-6',
      icon: 'size-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const Spinner = ({ size }: VariantProps<typeof spinnerVariants>) => {
  return <Loader className={cn(spinnerVariants({ size }))} />
}
