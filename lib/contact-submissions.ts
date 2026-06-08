// Shared contact submission types. All data access (public insert and admin
// reads/updates) is handled server-side: /api/contact for public submissions
// and admin server actions in app/admin/dashboard/actions.ts. This file no
// longer touches the browser anon Supabase client.

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactSubmission extends ContactFormData {
  id: string
  created_at: Date
  status: 'new' | 'read' | 'responded'
  admin_notes?: string
}

