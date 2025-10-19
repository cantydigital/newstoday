/**
 * Strips HTML tags from a string and returns plain text
 */
export function stripHtml(html: string): string {
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities (client-side only)
  let decoded = withoutTags
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = withoutTags
    decoded = textarea.value
  } else {
    // Server-side: basic entity decoding
    decoded = withoutTags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
  }
  
  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim()
}

/**
 * Truncates HTML content to a specified length while preserving word boundaries
 */
export function truncateHtml(html: string, maxLength: number = 150): string {
  const plainText = stripHtml(html)
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find the last space before the max length
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Checks if content contains HTML tags
 */
export function isHtmlContent(content: string): boolean {
  return /<[^>]*>/g.test(content)
}
