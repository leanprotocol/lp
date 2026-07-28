-- Innovation enquiries table for /innovation contact form.
-- Run this in the Supabase SQL editor.

create table if not exists public.innovation_enquiries (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  full_name          text        not null,
  organisation       text        not null,
  role               text        not null,
  work_email         text        not null,
  phone              text,
  collaboration_type text        not null,
  message            text        not null,
  consent            boolean     not null default false,
  source_page        text,
  user_agent         text
);

create index if not exists innovation_enquiries_created_at_idx
  on public.innovation_enquiries (created_at desc);

create index if not exists innovation_enquiries_type_idx
  on public.innovation_enquiries (collaboration_type);

-- Row level security: locked down by default.
-- The API route writes with the service-role key, which bypasses RLS.
-- No anon or authenticated policy is created, so the table is not readable
-- or writable from the browser.
alter table public.innovation_enquiries enable row level security;

revoke all on public.innovation_enquiries from anon, authenticated;
