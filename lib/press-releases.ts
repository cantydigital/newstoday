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
  getRejectedPressReleases,
  approvePressRelease,
  rejectPressRelease,
  restorePressReleaseToDraft,
  updatePressRelease,
  deletePressRelease,
} from "./press-releases-supabase"
