-- Add editorial review while preserving every existing post as published.
alter table public.posts
  add column if not exists status text not null default 'published',
  add column if not exists submitted_at timestamptz;

update public.posts set submitted_at = published_at where submitted_at is null;
alter table public.posts alter column submitted_at set default now();
alter table public.posts alter column submitted_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.posts'::regclass and conname = 'posts_status_check'
  ) then
    alter table public.posts add constraint posts_status_check
      check (status in ('pending', 'published', 'rejected', 'archived'));
  end if;
end;
$$;

create index if not exists posts_status_submitted_idx on public.posts (status, submitted_at desc);
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);

drop policy if exists "Published magazine posts are public" on public.posts;
create policy "Published magazine posts are public"
  on public.posts for select to anon, authenticated using (status = 'published');

-- A row lock serializes moderation with view tracking. Once a post is archived,
-- rejected, or pending, new view events cannot be recorded for it.
create or replace function public.record_post_view(p_post_id uuid, p_viewer_id uuid)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare current_status text;
begin
  select status into current_status
  from public.posts
  where id = p_post_id
  for update;

  if not found or current_status <> 'published' then return; end if;

  insert into public.post_views(post_id, viewer_id)
  values (p_post_id, p_viewer_id)
  on conflict (post_id, viewer_id, viewed_on) do nothing;
  if found then
    update public.posts set view_count = view_count + 1 where id = p_post_id;
  end if;
end;
$$;

revoke all on function public.record_post_view(uuid, uuid) from public, anon, authenticated;
grant execute on function public.record_post_view(uuid, uuid) to service_role;
