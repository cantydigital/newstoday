// Re-export all functions from the Supabase implementation
export {
  createPressRelease,
  createDraftPressRelease,
  getPressReleases,
  getPressReleaseById,
  getPressReleaseBySlug,
  getFeaturedPressReleases,
  getRecentPressReleases,
  getDraftPressReleases,
  approvePressRelease,
  rejectPressRelease,
  updatePressRelease,
  deletePressRelease,
} from "./press-releases-supabase"
