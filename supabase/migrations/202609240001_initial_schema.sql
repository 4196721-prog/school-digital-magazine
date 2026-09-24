create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 90),
  class_name text not null check (char_length(class_name) between 1 and 20),
  section text not null check (char_length(section) between 1 and 20),
  created_at timestamptz not null default now(),
  unique (name, class_name, section)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 2 and 140),
  author_name text not null,
  class_name text not null,
  section text not null,
  category text not null check (category in ('Articles','Blogs','Poetry','Stories','Artwork','Photography','School Activities','Achievements')),
  language text not null check (language in ('English','Urdu')),
  content text not null check (char_length(content) between 10 and 20000),
  cover_image text,
  published_at timestamptz not null default now(),
  view_count bigint not null default 0 check (view_count >= 0)
);

create table if not exists public.post_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  viewer_id uuid not null,
  viewed_on date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now(),
  unique (post_id, viewer_id, viewed_on)
);

create table if not exists public.submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_category_idx on public.posts (category, published_at desc);
create index if not exists posts_language_idx on public.posts (language, published_at desc);
create index if not exists posts_views_idx on public.posts (view_count desc);
create index if not exists posts_student_idx on public.posts (student_id);
create index if not exists post_views_date_idx on public.post_views (viewed_on desc);
create index if not exists submission_attempts_recent_idx on public.submission_attempts (ip_hash, attempted_at desc);

alter table public.students enable row level security;
alter table public.posts enable row level security;
alter table public.post_views enable row level security;
alter table public.submission_attempts enable row level security;

drop policy if exists "Published magazine posts are public" on public.posts;
create policy "Published magazine posts are public" on public.posts for select to anon, authenticated using (true);
-- All writes (submission, view accounting, and moderation) go through server-only service-role routes.

create or replace function public.record_post_view(p_post_id uuid, p_viewer_id uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  insert into public.post_views(post_id, viewer_id)
  values (p_post_id, p_viewer_id)
  on conflict (post_id, viewer_id, viewed_on) do nothing;
  if found then
    update public.posts set view_count = view_count + 1 where id = p_post_id;
  end if;
end;
$$;

create or replace function public.record_submission_attempt(p_ip text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare ip_digest text; recent_count integer;
begin
  ip_digest := encode(digest(coalesce(p_ip, 'unknown'), 'sha256'), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(ip_digest, 0));
  select count(*) into recent_count from public.submission_attempts where ip_hash = ip_digest and attempted_at > now() - interval '1 hour';
  if recent_count >= 5 then return false; end if;
  insert into public.submission_attempts(ip_hash) values (ip_digest);
  return true;
end;
$$;

revoke all on function public.record_post_view(uuid, uuid) from public, anon, authenticated;
revoke all on function public.record_submission_attempt(text) from public, anon, authenticated;
grant execute on function public.record_post_view(uuid, uuid) to service_role;
grant execute on function public.record_submission_attempt(text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('magazine-covers', 'magazine-covers', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Magazine covers are public" on storage.objects;
create policy "Magazine covers are public" on storage.objects for select to anon, authenticated using (bucket_id = 'magazine-covers');
