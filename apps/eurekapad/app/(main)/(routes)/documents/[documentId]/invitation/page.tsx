'use client'

import { useMutation } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useDocumentId } from '@/hooks/use-documentId'

const InvalidToken = ({ message }: { message: string }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src="/error.png" height="300" width="300" alt="Error" className="dark:hidden" />
      <Image src="/error-dark.png" height="300" width="300" alt="Error" className="hidden dark:block" />
      <h2 className="text-xl font-medium">{message}</h2>
      <Button asChild>
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  )
}

export default function InvitationAcceptPage() {
  const documentId = useDocumentId()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const router = useRouter()

  const acceptInvite = useMutation(api.documentPermissions.acceptInvite)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const accept = async () => {
      if (!token) {
        return
      }
      try {
        await acceptInvite({ token })
        toast.success('You have successfully joined the document!')
        router.push(`/documents/${documentId}`)
      } catch {
        setError(
          "Sorry, the invitation link is invalid or has expired. Please make sure you're logged in using the same email address the invitation was sent to.",
        )
      }
    }
    accept()
  }, [acceptInvite, documentId, router, token])

  if (!token) {
    return <InvalidToken message="Sorry, the invitation link is invalid or has expired." />
  }

  if (error) {
    return <InvalidToken message={error} />
  } else {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
}
