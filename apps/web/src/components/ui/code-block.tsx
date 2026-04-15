import { useEffect, useState, type ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { codeToHtml } from 'shiki'

interface ICodeBlockProps extends ComponentProps<"div"> {
  code: string
  language?: string
}

export const CodeBlock = ({ code, language = 'json', className, ...props }: ICodeBlockProps) => {
  const [parsedCode, setParsedCode] = useState<string>("")

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: 'vesper' }).then((html) => {
        setParsedCode(html)
      })
    }
  }, [code, language])

  return (
    <div className={twMerge("relative rounded-lg border border-zinc-700 overflow-x-auto", className)} {...props}>
      <div className="[&_pre]:p-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedCode }} />
    </div>
  )
}
