import { PartialInlineContent, StyledText } from '@blocknote/core'

import { imagesJSONSchema } from '@/components/editor/code/schemas'
import { customSchema } from '@/components/editor/schema'

type CustomPartialBlock = typeof customSchema.Block
type CustomInlineContent = Extract<CustomPartialBlock['content'], PartialInlineContent<any, any>>

const fromTemplate = (latex: string) => {
  return (
    `\\documentclass[a4paper,12pt]{article}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage{graphicx}
\\usepackage{float}

\\definecolor{backcolour}{rgb}{0.95,0.95,0.92}
\\definecolor{mauve}{rgb}{0.58,0,0.82}
\\definecolor{codegreen}{rgb}{0,0.6,0}
\\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\\lstset{
  numberstyle=\\tiny\\color{gray},
  keywordstyle=\\color{blue},
  commentstyle=\\color{codegreen},
  stringstyle=\\color{mauve},
  backgroundcolor=\\color{backcolour},
  basicstyle=\\ttfamily\\footnotesize,
  breakatwhitespace=false,         
  breaklines=true,                 
  keepspaces=true,                 
  numbers=left,       
  numbersep=5pt,                  
  showspaces=false,                
  showstringspaces=false,
  showtabs=false,                  
  tabsize=2,
  frame=single,
  columns=flexible
}

\\lstdefinestyle{redText}{
    basicstyle=\\color{red}\\ttfamily\\footnotesize,
    breaklines=true,
    breakatwhitespace=true,
    showstringspaces=false,
}

\\begin{document}\n` +
    latex +
    `\n\\end{document}`
  )
}

function escapeLatex(text: string): string {
  const replacements = [
    { pattern: /\\/g, replacement: '\\textbackslash ' },
    { pattern: /([{}$&%#_])/g, replacement: '\\$1' },
    { pattern: /\^/g, replacement: '\\^{}' },
    { pattern: /~/g, replacement: '\\~{}' },
  ]
  let escaped = text
  for (const { pattern, replacement } of replacements) {
    escaped = escaped.replace(pattern, replacement)
  }
  return escaped
    .split('')
    .filter(char => char.charCodeAt(0) <= 126)
    .join('')
}

function fixLatexArray(input: string): string {
  return input.replace(/\\begin{array}(?!\{[lcr|]+\})(\s*[\s\S]*?)\\end{array}/g, (match, content) => {
    // Split the content by line breaks or double backslashes to detect columns
    const rows = content.split(/\\\\/).map((row: string) => row.trim())

    // Determine the maximum number of columns
    const maxColumns = Math.max(...rows.map((row: string) => (row.match(/&/g) || []).length + 1))

    // Generate alignment specifier (e.g., "ccc" for 3 columns)
    const alignment = 'c'.repeat(maxColumns)

    // Add the alignment specifier to the \begin{array}
    return match.replace(/\\begin{array}/, `\\begin{array}{${alignment}}`)
  })
}

function processImageUrl(url: string): string {
  const fileName = fileNameFromUrl(url)
  return `\\begin{figure}[H]\n\\centering\n\\includegraphics[width=0.75\\textwidth]{./${fileName}}\n\\end{figure}\n\n`
}

function extractTextFromContent(content: CustomInlineContent, escape: boolean = true): string {
  let parts = []
  for (const c of content) {
    const ctype = c.type
    if (ctype === 'text') {
      const text = (c as StyledText<typeof customSchema.styleSchema>).text || ''
      parts.push(escape ? escapeLatex(text) : text)
    } else if (ctype === 'mathInline') {
      const innerText = fixLatexArray(extractTextFromContent(c.content || [], false))
      if (innerText.length === 0) {
        continue
      }
      parts.push(`$${innerText}$`)
    }
  }
  return parts.join('')
}

let currentListType: 'bullet' | 'numbered' | null = null
let listBuffer: string[] = []

function processNode(node: CustomPartialBlock): string {
  const nodeType = node.type || ''

  if (nodeType !== 'bulletListItem' && nodeType !== 'numberedListItem' && currentListType) {
    const result = flushList()
    currentListType = null
    return result + processNonListNode(node)
  }

  if (nodeType === 'paragraph') {
    const text = extractTextFromContent((node.content as CustomInlineContent) || []).trim()
    return text ? text + '\n\n' : '\n\n'
  } else if (nodeType === 'math') {
    const mathText = fixLatexArray(extractTextFromContent((node.content as CustomInlineContent) || [], false))
    if (mathText.length === 0) return ''
    return `\\[\n${mathText}\n\\]\n\n`
  } else if (nodeType === 'codeblock') {
    const props = (node as Extract<CustomPartialBlock, { type: 'codeblock' }>).props || {}
    const code = props.code || ''
    const language = (props.language || 'text').charAt(0).toUpperCase() + (props.language || 'text').slice(1)
    let result = `\\begin{lstlisting}[language=${language}]\n${code}\n\\end{lstlisting}\n\n`

    if (props.stdout) {
      result += `\\begin{lstlisting}\n${props.stdout}\n\\end{lstlisting}\n\n`
    }
    if (props.stderr) {
      result += `\\begin{lstlisting}[style=redText]\n${props.stderr
        .split('')
        .filter(char => {
          const code = char.charCodeAt(0)
          return (code >= 32 && code <= 126) || char === '\n' || char === '\t' // printable ASCII characters
        })
        .join('')}\n\\end{lstlisting}\n\n`
    }
    for (const imgUrl of imagesJSONSchema.parse(props.images)) {
      result += processImageUrl(imgUrl.href)
    }
    return result
  } else if (nodeType === 'table') {
    const tableContent = (node as Extract<CustomPartialBlock, { type: 'table' }>).content || {}
    if (tableContent.type === 'tableContent') {
      const rows = tableContent.rows || []
      const colWidths = tableContent.columnWidths || []
      const alignment = colWidths.map(() => 'l').join('|')
      const rowLines = rows.map(r => {
        const cells = r.cells || []
        const cellTexts = cells.map(cell => {
          return cell
            .map(x =>
              x.type === 'text' ? escapeLatex((x as StyledText<typeof customSchema.styleSchema>).text || '') : '',
            )
            .join('')
        })
        return cellTexts.join(' & ') + ' \\\\'
      })
      return `\\begin{tabular}{${alignment}}\n${rowLines.join('\n\\hline\n')}\n\\end{tabular}\n\n`
    }
    return ''
  } else if (nodeType === 'heading') {
    const props: any = node.props
    const headingLevel: number = props.level
    const headingMap: Record<number, string> = {
      1: 'section',
      2: 'subsection',
      3: 'subsubsection',
    }
    const sectionType = headingMap[headingLevel]
    if (!sectionType) return ''
    const text = extractTextFromContent((node.content as CustomInlineContent) || []).trim()
    return text ? `\\${sectionType}{${text}}\n\n` : '\n\n'
  } else if (nodeType === 'bulletListItem' || nodeType === 'numberedListItem') {
    const text = extractTextFromContent((node.content as CustomInlineContent) || []).trim()
    const isNewListType =
      (nodeType === 'bulletListItem' && currentListType !== 'bullet') ||
      (nodeType === 'numberedListItem' && currentListType !== 'numbered')

    if (currentListType && isNewListType) {
      const result = flushList()
      currentListType = null
      listBuffer = []
      return result + processListItem(nodeType, text)
    }

    return processListItem(nodeType, text)
  } else if (nodeType === 'image') {
    const props = (node as Extract<CustomPartialBlock, { type: 'image' }>).props || {}
    return processImageUrl(props.url)
  }
  return ''
}

function processListItem(type: string, text: string): string {
  if (!currentListType) {
    currentListType = type === 'bulletListItem' ? 'bullet' : 'numbered'
    listBuffer = []
  }

  listBuffer.push(`\\item ${text}`)
  return ''
}

function flushList(): string {
  if (!currentListType || listBuffer.length === 0) return ''

  const environment = currentListType === 'bullet' ? 'itemize' : 'enumerate'
  const result = `\\begin{${environment}}\n${listBuffer.join('\n')}\n\\end{${environment}}\n\n`
  listBuffer = []
  return result
}

function processNonListNode(node: CustomPartialBlock): string {
  return processNode(node)
}

function finalizeProcessing(): string {
  if (currentListType) {
    const result = flushList()
    currentListType = null
    return result
  }
  return ''
}

function fileNameFromUrl(url: string): string {
  const result = url.match(/[^/]+$/)?.[0] || url.slice(-10)
  if (/\.\w+$/.test(result)) {
    return result
  }
  return result + '.png'
}

export async function getAllImages(data: CustomPartialBlock[]): Promise<Record<string, Uint8Array>> {
  const images: Record<string, Uint8Array> = {}
  let urls: string[] = []
  for (const node of data) {
    if (node.type === 'image') {
      const props = (node as Extract<CustomPartialBlock, { type: 'image' }>).props || {}
      urls.push(props.url)
    } else if (node.type === 'codeblock') {
      const props = (node as Extract<CustomPartialBlock, { type: 'codeblock' }>).props || {}
      urls = urls.concat(imagesJSONSchema.parse(props.images).map((url: URL) => url.href))
    }
  }

  for (const url of urls) {
    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    const fileData = new Uint8Array(buffer)
    const fileName = fileNameFromUrl(url)

    if (fileName) {
      images[fileName] = fileData
    }
  }
  return images
}

export function blocksToLaTeX(data: CustomPartialBlock[]): string {
  if (data.length === 0) {
    // hack to prevent empty document from erroring
    return fromTemplate('No content')
  }
  // const content = data.map(node => processNode(node)).join('')
  let output = ''
  for (const node of data) {
    output += processNode(node)
  }
  output += finalizeProcessing()
  return fromTemplate(output)
}
