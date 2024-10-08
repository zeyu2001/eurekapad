'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import type { Emoji as EmojiMart } from 'emoji-mart'
import { useTheme } from 'next-themes'

interface IconPickerProps {
  onChange: (_icon: string) => void
  children: React.ReactNode
  asChild?: boolean
}

/**
 * Currently, type definitions in `@emoji-mart/react` isn't perfect, so we implement our own.
 * ref. https://github.com/missive/emoji-mart/issues/576
 */

type Emoji = typeof EmojiMart.Props

interface Category {
  id: string
  name: string
  emojis: string[]
}

interface Data {
  compressed: boolean
  categories: Category[]
  emojis: Record<string, Emoji>
  aliases: Record<string, string>
}

interface PickerProps {
  data: Data
  theme: 'auto' | 'light' | 'dark'
  onEmojiSelect: (_emoji: Emoji) => void
}

function EmojiPicker(props: PickerProps) {
  return <Picker {...props} />
}

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function IconPicker({ onChange, children, asChild }: IconPickerProps) {
  const { resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : 'auto'

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker data={data as Data} theme={currentTheme} onEmojiSelect={data => onChange(data.native)} />
      </PopoverContent>
    </Popover>
  )
}
