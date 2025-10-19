import { supabase } from "./supabase"

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

const TABLE_NAME = "contact_submissions"

export async function submitContactForm(data: ContactFormData): Promise<string> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: 'new'
    })
    .select('id')
    .single()

  if (error) {
    console.error("Error submitting contact form:", error)
    throw new Error(`Failed to submit contact form: ${error.message}`)
  }

  return result.id
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching contact submissions:", error)
    return []
  }

  return data.map(transformSupabaseToContactSubmission)
}

export async function getNewContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', 'new')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching new contact submissions:", error)
    return []
  }

  return data.map(transformSupabaseToContactSubmission)
}

export async function markContactSubmissionAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: 'read' })
    .eq('id', id)

  if (error) {
    console.error("Error marking contact submission as read:", error)
    throw new Error(`Failed to mark contact submission as read: ${error.message}`)
  }
}

export async function markContactSubmissionAsResponded(id: string, adminNotes?: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ 
      status: 'responded',
      admin_notes: adminNotes || null
    })
    .eq('id', id)

  if (error) {
    console.error("Error marking contact submission as responded:", error)
    throw new Error(`Failed to mark contact submission as responded: ${error.message}`)
  }
}

export async function updateContactSubmissionNotes(id: string, adminNotes: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ admin_notes: adminNotes })
    .eq('id', id)

  if (error) {
    console.error("Error updating contact submission notes:", error)
    throw new Error(`Failed to update contact submission notes: ${error.message}`)
  }
}

// Helper function to transform Supabase row to ContactSubmission interface
function transformSupabaseToContactSubmission(row: any): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    created_at: new Date(row.created_at),
    status: row.status,
    admin_notes: row.admin_notes,
  }
}
