import { PartialInlineContent, StyledText } from '@blocknote/core'

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
}

function extractTextFromContent(content: CustomInlineContent, escape: boolean = true): string {
  let parts = []
  for (const c of content) {
    const ctype = c.type
    if (ctype === 'text') {
      const text = (c as StyledText<typeof customSchema.styleSchema>).text || ''
      parts.push(escape ? escapeLatex(text) : text)
    } else if (ctype === 'mathInline') {
      const innerText = extractTextFromContent(c.content || [], false)
      if (innerText.length === 0) {
        continue
      }
      parts.push(`$${innerText}$`)
    }
  }
  return parts.join('')
}

function processNode(node: CustomPartialBlock): string {
  const nodeType = node.type || ''

  if (nodeType === 'paragraph') {
    const text = extractTextFromContent((node.content as CustomInlineContent) || []).trim()
    return text ? text + '\n\n' : '\n\n'
  } else if (nodeType === 'math') {
    // Display math: \[...\]
    const mathText = extractTextFromContent((node.content as CustomInlineContent) || [], false)
    if (mathText.length === 0) {
      return ''
    }
    return `\\[\n${mathText}\n\\]\n\n`
  } else if (nodeType === 'codeblock') {
    // Use lstlisting environment
    const props = (node as Extract<CustomPartialBlock, { type: 'codeblock' }>).props || {}
    const code = props.code || ''
    const language = (props.language || 'text').charAt(0).toUpperCase() + (props.language || 'text').slice(1)
    return `\\begin{lstlisting}[language=${language}]\n${code}\n\\end{lstlisting}\n\n`
  } else if (nodeType === 'table') {
    const tableContent = (node as Extract<CustomPartialBlock, { type: 'table' }>).content || {}
    if (tableContent.type === 'tableContent') {
      const rows = tableContent.rows || []
      const colWidths = tableContent.columnWidths || []
      const alignment = colWidths.map(() => 'l').join('')
      const rowLines = rows.map(r => {
        const cells = r.cells || []
        const cellTexts = cells.map(cell => {
          // cell is an array of content nodes
          return cell
            .map(x =>
              x.type === 'text' ? escapeLatex((x as StyledText<typeof customSchema.styleSchema>).text || '') : '',
            )
            .join('')
        })
        return cellTexts.join(' & ') + ' \\\\'
      })
      return `\\begin{tabular}{${alignment}}\n${rowLines.join('\n')}\n\\end{tabular}\n\n`
    }
    return ''
  }

  // Unknown or unsupported node type
  return ''
}

export function blocksToLaTeX(data: CustomPartialBlock[]): string {
  const content = data.map(node => processNode(node)).join('')
  return fromTemplate(content)
}
