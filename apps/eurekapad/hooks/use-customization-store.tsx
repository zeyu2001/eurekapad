import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CustomizationStore {
  // Document Styling
  fontType: string
  fontSize: string
  textColor: string
  headingsColor: string
  margins: string
  lineSpacing: string

  // Actions
  setFontType: (font: string) => void
  setFontSize: (size: string) => void
  setTextColor: (color: string) => void
  setHeadingsColor: (color: string) => void
  setMargins: (margins: string) => void
  setLineSpacing: (spacing: string) => void
  reset: () => void
}

const defaultValues = {
  fontType: 'Computer Modern',
  fontSize: '12pt',
  textColor: '#000000',
  headingsColor: '#000000',
  margins: '1.0',
  lineSpacing: '1.0',
}

export const useCustomizationStore = create<CustomizationStore>()(
  persist(
    set => ({
      // Initial state
      ...defaultValues,

      // Actions
      setFontType: font => set({ fontType: font }),
      setFontSize: size => set({ fontSize: size }),
      setTextColor: color => set({ textColor: color }),
      setHeadingsColor: color => set({ headingsColor: color }),
      setMargins: margins => set({ margins }),
      setLineSpacing: spacing => set({ lineSpacing: spacing }),
      reset: () => set(defaultValues),
    }),
    {
      name: 'customization-storage',
    },
  ),
)
