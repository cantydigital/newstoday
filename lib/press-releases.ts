// Re-export read functions from the Supabase implementation.
// All mutating operations live in app/admin/dashboard/actions.ts (admin
// server actions) or /api/press-release/submit (public submission endpoint).
export {
  getPressReleases,
  getPressReleaseBySlug,
  getFeaturedPressReleases,
  getRecentPressReleases,
} from "./press-releases-supabase"
