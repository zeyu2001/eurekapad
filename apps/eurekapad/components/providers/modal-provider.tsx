'use client'

import { CoverImageModal } from '@/components/modals/cover-image-modal'
import { SettingsModal } from '@/components/modals/settings-modal'

export function ModalProvider() {
  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  )
}
