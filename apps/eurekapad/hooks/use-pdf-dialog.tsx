import { create } from 'zustand'

type PdfDialogStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const usePdfDialog = create<PdfDialogStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
