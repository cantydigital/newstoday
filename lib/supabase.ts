import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly rather than silently falling back to placeholder credentials,
  // which would produce confusing runtime errors instead of a clear message.
  throw new Error(
    'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      press_releases: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          content: string
          category: string
          author: string
          company: string
          contact_email: string
          contact_phone: string | null
          published_at: string | null
          created_at: string
          status: 'draft' | 'published' | 'rejected'
          featured: boolean | null
          image_url: string | null
          rejection_reason: string | null
          payment_received: boolean
          published_url: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          content: string
          category: string
          author: string
          company: string
          contact_email: string
          contact_phone?: string | null
          published_at?: string | null
          created_at?: string
          status?: 'draft' | 'published' | 'rejected'
          featured?: boolean | null
          image_url?: string | null
          rejection_reason?: string | null
          payment_received?: boolean
          published_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          content?: string
          category?: string
          author?: string
          company?: string
          contact_email?: string
          contact_phone?: string | null
          published_at?: string | null
          created_at?: string
          status?: 'draft' | 'published' | 'rejected'
          featured?: boolean | null
          image_url?: string | null
          rejection_reason?: string | null
          payment_received?: boolean
          published_url?: string | null
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          created_at: string
          status: 'new' | 'read' | 'responded'
          admin_notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          created_at?: string
          status?: 'new' | 'read' | 'responded'
          admin_notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          created_at?: string
          status?: 'new' | 'read' | 'responded'
          admin_notes?: string | null
        }
      }
    }
  }
}
