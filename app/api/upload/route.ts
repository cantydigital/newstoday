import { NextRequest, NextResponse } from "next/server"
import { assertSupabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const BUCKET = "images"

// Allowed image types mapped to their canonical extension.
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

/**
 * Inspect the leading bytes of the file to confirm it really is the image type
 * it claims to be. The client-side content-type and extension are not trusted.
 */
function sniffMime(bytes: Uint8Array): string | null {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg"
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png"
  }
  // GIF: 47 49 46 38
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif"
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp"
  }
  return null
}

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB" },
      { status: 400 }
    )
  }

  const buffer = new Uint8Array(await file.arrayBuffer())

  // Trust the magic bytes, not the client-supplied content-type.
  const detected = sniffMime(buffer.subarray(0, 12))
  if (!detected || !ALLOWED[detected]) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: JPG, PNG, GIF, WebP." },
      { status: 400 }
    )
  }

  const ext = ALLOWED[detected]
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
  const filePath = `press-releases/${fileName}`

  const supabase = assertSupabaseAdmin()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: detected,
    })

  if (uploadError) {
    console.error("[api/upload] upload failed", uploadError)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

  return NextResponse.json({ url: publicUrl, path: filePath })
}
