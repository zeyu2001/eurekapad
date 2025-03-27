import { Spinner } from '@/components/spinner'

export default function MainLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
