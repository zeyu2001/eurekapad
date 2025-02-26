'use client'

import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'

import { api } from '@/convex/_generated/api'
import { useDocumentId } from '@/hooks/use-documentId'

import { Publish } from '../publish'
import { Banner } from './banner'
import { Export } from './export'
import { Menu } from './menu'
import { Share } from './share'
import { Title } from './title'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const documentId = useDocumentId()

  const document = useQuery(api.documents.getById, { documentId })
  const userPermissions = useQuery(api.documentPermissions.getUserPermissions, { documentId })

  if (document === undefined || userPermissions === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground" />}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Export document={document} />
            {userPermissions.isOwner && (
              <>
                <Share document={document} />
                <Publish initialData={document} />
                <Menu documentId={document._id} />
              </>
            )}
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
