"use client"

import { cn } from '@/lib/utils'

interface HtmlContentProps {
  content: string
  className?: string
}

export default function HtmlContent({ content, className }: HtmlContentProps) {
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none text-justify",
        "prose-headings:text-foreground prose-p:text-muted-foreground prose-p:mb-4 prose-p:text-justify",
        "prose-strong:text-foreground prose-em:text-muted-foreground",
        "prose-blockquote:text-muted-foreground prose-blockquote:border-border prose-blockquote:text-justify",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted prose-pre:text-foreground",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-ul:mb-4 prose-ol:mb-4",
        "prose-li:text-muted-foreground prose-li:text-justify",
        "prose-h1:mb-4 prose-h2:mb-4 prose-h3:mb-3 prose-h4:mb-3",
        "[&>*]:mb-4 [&>*:last-child]:mb-0",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
