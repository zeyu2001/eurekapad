import { CSSProp } from 'styled-components'

declare module 'react' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Attributes {
    css?: CSSProp
  }
}

import { parse } from 'ansicolor'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const ansiToSpans = (text: string) => {
  return parse(text).spans.map((span, i) => (
    <span key={i} css={span.css}>
      {span.text}
    </span>
  ))
}

export const getTitle = (subtitle: string) => `${subtitle} | EurekaPad`

export const getUrlFriendlyTitle = (title: string, id: string) =>
  `${title
    .trim()
    .replace(/[^0-9a-z_]/gi, '-')
    .replace(/\-+/g, '-')
    .replace(/-$/, '')
    .split(/-/)
    .reduce((acc, curr) => (`${acc}-${curr}`.length <= 100 ? `${acc}-${curr}` : acc))}-${id}`
