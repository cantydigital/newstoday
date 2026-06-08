import sanitizeHtmlLib from "sanitize-html"

/**
 * Strict allowlist sanitizer for user-submitted rich text (Tiptap output).
 *
 * Server-only (uses sanitize-html, a pure Node.js CJS package with no DOM
 * dependency). Call this at write time (submit / update paths) before
 * persisting to the database. Client components render the already-sanitized
 * content directly.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "blockquote",
  "code",
  "pre",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "span",
  "hr",
]

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ""
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["https", "http"],
    },
  })
}

/**
 * Validate a user-provided image URL. Must be an absolute https:// URL. When a
 * Supabase storage host can be derived from NEXT_PUBLIC_SUPABASE_URL, the URL
 * must also point at that host (images are uploaded there). Returns the
 * normalized URL string if valid, otherwise null.
 */
export function validateImageUrl(
  value: string | null | undefined
): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (url.protocol !== "https:") return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    try {
      const allowedHost = new URL(supabaseUrl).host
      if (url.host !== allowedHost) return null
    } catch {
      // If the configured URL is malformed, fall back to https-only check.
    }
  }

  return url.toString()
}
