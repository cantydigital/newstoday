import DOMPurify from "isomorphic-dompurify"

/**
 * Strict allowlist sanitizer for user-submitted rich text (Tiptap output).
 *
 * Works on both server and client (isomorphic-dompurify). We sanitize on
 * storage (in the submit/update paths) AND on render (HtmlContent / preview)
 * so that any pre-existing unsanitized rows are also rendered safely.
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

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "width",
  "height",
  "style",
  "class",
]

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ""
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Block javascript:/data: URIs in href/src etc. Only allow safe schemes.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
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
