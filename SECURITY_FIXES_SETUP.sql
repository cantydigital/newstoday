-- =============================================================================
-- Security hardening setup
-- Run this in the Supabase SQL editor after deploying the related code changes.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Admin sessions table (Fix #1: unforgeable admin session cookie)
--    The admin cookie now stores a random opaque token that must exist (and be
--    unexpired) in this table. It is validated server-side, never by string
--    equality to a literal value.
-- -----------------------------------------------------------------------------
create table if not exists public.admin_sessions (
  token       text primary key,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);

create index if not exists idx_admin_sessions_expires_at
  on public.admin_sessions (expires_at);

-- Only the service-role key (used by the server) should ever touch this table.
-- Enable RLS with NO policies so the public anon key has zero access.
alter table public.admin_sessions enable row level security;

-- Optional: periodically purge expired sessions. Safe to run any time.
-- delete from public.admin_sessions where expires_at <= now();


-- -----------------------------------------------------------------------------
-- 2. Storage policies for the `images` bucket
--    (Fix #4: no unauthenticated/anon uploads)
--    Uploads now go through the server route /api/upload using the service-role
--    key, which bypasses RLS. We therefore REMOVE any permissive anon
--    insert/update/delete policies so anonymous users cannot write directly.
--    Public read remains so published images are viewable.
-- -----------------------------------------------------------------------------

-- Drop any previously-created permissive policies (names may vary in your project;
-- adjust/add as needed). These IF EXISTS guards make the script idempotent.
drop policy if exists "Public can upload images"        on storage.objects;
drop policy if exists "Anyone can upload images"         on storage.objects;
drop policy if exists "Public Access"                    on storage.objects;
drop policy if exists "Anon can insert images"           on storage.objects;
drop policy if exists "Anon can update images"           on storage.objects;
drop policy if exists "Anon can delete images"           on storage.objects;

-- Allow PUBLIC READ of objects in the images bucket (needed to display images).
drop policy if exists "Public read images" on storage.objects;
create policy "Public read images"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- NOTE: We intentionally do NOT create any insert/update/delete policy for the
-- anon/authenticated roles on the images bucket. All writes happen via the
-- service-role key in the server route, which is exempt from RLS.


-- -----------------------------------------------------------------------------
-- 3. Lock down press_releases (Fix #5)
--    ALL mutations AND all admin reads (drafts/rejected/by-id) now run
--    server-side with the service-role key. The browser anon key only ever
--    needs SELECT on PUBLISHED rows (public pages + the admin "All Releases"
--    list). It is now safe to fully lock this table down.
-- -----------------------------------------------------------------------------
alter table public.press_releases enable row level security;

drop policy if exists "Public read published" on public.press_releases;
create policy "Public read published"
  on public.press_releases for select
  using ( status = 'published' );

-- Remove any permissive anon write/read-all policies you previously had:
drop policy if exists "Public read all"        on public.press_releases;
drop policy if exists "Anon insert"            on public.press_releases;
drop policy if exists "Anon update"            on public.press_releases;
drop policy if exists "Anon delete"            on public.press_releases;
-- (Do NOT add anon insert/update/delete or read-all policies.)


-- -----------------------------------------------------------------------------
-- 4. Lock down contact_submissions
--    Public inserts go through /api/contact (service-role) and all admin
--    reads/updates go through admin server actions (service-role). The anon
--    key needs NO access at all. Enable RLS with no policies.
-- -----------------------------------------------------------------------------
alter table public.contact_submissions enable row level security;

drop policy if exists "Public can insert contact" on public.contact_submissions;
drop policy if exists "Anon read contact"          on public.contact_submissions;
drop policy if exists "Public read contact"        on public.contact_submissions;
-- No policies = anon has zero access; only the service-role key (server) can
-- read/insert/update contact submissions.
