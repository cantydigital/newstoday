// Re-export all functions from the Supabase implementation
export {
  createPressRelease,
  createDraftPressRelease,
  getPressReleases,
  getPressReleaseById,
  getPressReleaseBySlug,
  getFeaturedPressReleases,
  getDraftPressReleases,
  approvePressRelease,
  rejectPressRelease,
  updatePressRelease,
} from "./press-releases-supabase"
