import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

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
