import { CoverSkeleton } from '@/components/coverSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocumentLoading() {
  return (
    <div>
      <CoverSkeleton />
      <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-1/2" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  )
}
