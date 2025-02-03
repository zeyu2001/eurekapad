import '@blocknote/mantine/style.css'

import { defaultProps, InlineContentSchema, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation } from '@blocknote/react'
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
  DotIcon,
  GripHorizontal,
  Minus,
  SeparatorHorizontalIcon,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { insertBlockAndFocus } from '@/lib/insert-block'
import { cn } from '@/lib/utils'

import { CustomEditor } from '../schema'

export const separatorStyles = [
  {
    title: 'Solid Line',
    value: 'solid',
    icon: Minus,
  },
  {
    title: 'Dotted Line',
    value: 'dotted',
    icon: DotIcon,
  },
  {
    title: 'Dashed Line',
    value: 'dashed',
    icon: GripHorizontal,
  },
] as const

type SeparatorProps = {
  variant: {
    default: 'solid'
    values: ['solid', 'dotted', 'dashed']
  }
  label: {
    default: string
  }
  spacing: {
    default: 'default'
    values: ['compact', 'default', 'relaxed']
  }
}

type SeparatorBlockConfig = {
  type: 'separator'
  propSchema: typeof defaultProps & SeparatorProps
  content: 'inline'
  isFileBlock: false
}

const separatorBlockConfig: SeparatorBlockConfig = {
  type: 'separator',
  propSchema: {
    ...defaultProps,
    variant: {
      default: 'solid',
      values: ['solid', 'dotted', 'dashed'],
    },
    label: {
      default: '',
    },
    spacing: {
      default: 'default',
      values: ['compact', 'default', 'relaxed'],
    },
  },
  content: 'inline',
  isFileBlock: false,
}

type SeparatorVariant = 'solid' | 'dotted' | 'dashed'
type SeparatorSpacing = 'compact' | 'default' | 'relaxed'

const spacingClasses: Record<SeparatorSpacing, string> = {
  compact: 'my-2',
  default: 'my-4',
  relaxed: 'my-6',
}

const lineClasses: Record<SeparatorVariant, string> = {
  solid: 'border-t border-muted-foreground/30',
  dotted: 'border-t border-dotted border-muted-foreground/30',
  dashed: 'border-t border-dashed border-muted-foreground/30',
}

const separatorBlockImpl: ReactCustomBlockImplementation<SeparatorBlockConfig, InlineContentSchema, StyleSchema> = {
  render: ({ block, editor }) => {
    const variant = (block.props.variant as SeparatorVariant) || 'solid'
    const spacing = (block.props.spacing as SeparatorSpacing) || 'default'
    const label = (block.props.label as string) || ''

    return (
      <div
        className={cn(
          'flex w-full items-center justify-center relative',
          spacingClasses[spacing],
          'group hover:bg-muted/20 rounded transition-colors cursor-pointer',
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full flex items-center justify-center py-2">
              {label ? (
                <div className="flex items-center w-full gap-4">
                  <div
                    className={cn(
                      'flex-grow',
                      lineClasses[variant],
                      'bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent',
                      'group-hover:via-muted-foreground/50',
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {/* {(() => {
                                        const Icon = separatorStyles.find(s => s.value === variant)?.icon || Minus;
                                        return <Icon size={16} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />;
                                    })()} */}
                    <span className="text-sm text-muted-foreground/50 whitespace-nowrap px-2 group-hover:text-muted-foreground transition-colors">
                      {label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex-grow',
                      lineClasses[variant],
                      'bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent',
                      'group-hover:via-muted-foreground/50',
                    )}
                  />
                </div>
              ) : (
                <div className="w-full flex items-center gap-2">
                  {/* {(() => {
                                    const Icon = separatorStyles.find(s => s.value === variant)?.icon || Minus;
                                    return <Icon size={16} className="text-muted-foreground/50 group-hover:text-muted-foreground absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity" />;
                                })()} */}
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    className={cn(
                      'w-full',
                      lineClasses[variant],
                      'bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent',
                      'group-hover:via-muted-foreground/50',
                    )}
                  />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Separator Style</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {separatorStyles.map(style => {
              const Icon = style.icon
              const isSelected = style.value === variant
              return (
                <DropdownMenuItem
                  key={style.value}
                  onClick={() => {
                    editor.updateBlock(block, {
                      type: 'separator',
                      props: { ...block.props, variant: style.value },
                    })
                  }}
                >
                  <Icon className={cn('mr-2 h-4 w-4', isSelected && 'text-primary')} />
                  <span className={cn(isSelected && 'text-primary font-medium')}>{style.title}</span>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Spacing</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                editor.updateBlock(block, {
                  type: 'separator',
                  props: { ...block.props, spacing: 'compact' },
                })
              }}
            >
              <ArrowDownNarrowWide className={cn('mr-2 h-4 w-4', spacing === 'compact' && 'text-primary')} />
              <span className={cn(spacing === 'compact' && 'text-primary font-medium')}>Compact</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.updateBlock(block, {
                  type: 'separator',
                  props: { ...block.props, spacing: 'default' },
                })
              }}
            >
              <ArrowUpDown className={cn('mr-2 h-4 w-4', spacing === 'default' && 'text-primary')} />
              <span className={cn(spacing === 'default' && 'text-primary font-medium')}>Default</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.updateBlock(block, {
                  type: 'separator',
                  props: { ...block.props, spacing: 'relaxed' },
                })
              }}
            >
              <ArrowDownWideNarrow className={cn('mr-2 h-4 w-4', spacing === 'relaxed' && 'text-primary')} />
              <span className={cn(spacing === 'relaxed' && 'text-primary font-medium')}>Relaxed</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
}

export const separatorBlockSpec = createReactBlockSpec<SeparatorBlockConfig, InlineContentSchema, StyleSchema>(
  separatorBlockConfig,
  separatorBlockImpl,
)

// export const insertSeparatorWithLabelBlock = (editor: CustomEditor) => ({
//     title: 'Separator'
// })

export const insertSeparatorBlock = (editor: CustomEditor) => ({
  title: 'Separator',
  onItemClick: () => {
    insertBlockAndFocus(editor, {
      type: 'separator',
      props: {
        variant: 'solid',
        spacing: 'default',
        label: '',
      },
    })
  },
  icon: <SeparatorHorizontalIcon size={16} />,
  aliases: ['separator', 'horizontal', 'divider', 'line'],
  group: 'Others',
  subtext: 'Add a separator line with optional text label',
  children: [
    {
      title: 'Solid Line',
      onItemClick: () => {
        insertBlockAndFocus(editor, {
          type: 'separator',
          props: { variant: 'solid', spacing: 'default' },
        })
      },
      subtext: 'Simple solid line separator',
    },
    {
      title: 'Dotted Line',
      onItemClick: () => {
        insertBlockAndFocus(editor, {
          type: 'separator',
          props: { variant: 'dotted', spacing: 'default' },
        })
      },
      subtext: 'Dotted line separator',
    },
    {
      title: 'Dashed Line',
      onItemClick: () => {
        insertBlockAndFocus(editor, {
          type: 'separator',
          props: { variant: 'dashed', spacing: 'default' },
        })
      },
      subtext: 'Dashed line separator',
    },
    {
      title: 'With Label',
      onItemClick: () => {
        insertBlockAndFocus(editor, {
          type: 'separator',
          props: { variant: 'solid', spacing: 'default', label: 'Section' },
        })
      },
      subtext: 'Separator with centered text label',
    },
  ],
})
