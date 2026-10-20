alter table public.posts
  add column if not exists editorial_rank integer not null default 0,
  add column if not exists editorial_featured boolean not null default false;

create unique index if not exists posts_editorial_rank_override_unique_idx
  on public.posts (editorial_rank)
  where editorial_rank <> 0;

create index if not exists posts_published_editorial_order_idx
  on public.posts (editorial_rank desc, published_at desc)
  where status = 'published';

create index if not exists posts_published_featured_order_idx
  on public.posts (editorial_featured desc, editorial_rank desc, published_at desc)
  where status = 'published';

create or replace function public.update_published_post_editorial(p_post_id uuid, p_action text)
returns table (editorial_rank integer, editorial_featured boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  next_rank integer;
begin
  if p_action is null or p_action not in ('promote', 'lower', 'reset-rank', 'feature', 'unfeature') then
    raise exception 'Unsupported editorial action';
  end if;

  if p_action in ('promote', 'lower', 'reset-rank') then
    perform pg_advisory_xact_lock(hashtextextended('public.posts.editorial_rank', 0));
  end if;

  if not exists (
    select 1 from public.posts p where p.id = p_post_id and p.status = 'published'
  ) then
    return;
  end if;

  if p_action = 'promote' then
    select greatest(coalesce(max(p.editorial_rank), 0), 0) + 1
      into next_rank from public.posts p;
    update public.posts p set editorial_rank = next_rank
      where p.id = p_post_id and p.status = 'published';
  elsif p_action = 'lower' then
    select least(coalesce(min(p.editorial_rank), 0), 0) - 1
      into next_rank from public.posts p;
    update public.posts p set editorial_rank = next_rank
      where p.id = p_post_id and p.status = 'published';
  elsif p_action = 'reset-rank' then
    update public.posts p set editorial_rank = 0
      where p.id = p_post_id and p.status = 'published';
  elsif p_action = 'feature' then
    update public.posts p set editorial_featured = true
      where p.id = p_post_id and p.status = 'published';
  elsif p_action = 'unfeature' then
    update public.posts p set editorial_featured = false
      where p.id = p_post_id and p.status = 'published';
  end if;

  return query
    select p.editorial_rank, p.editorial_featured
    from public.posts p
    where p.id = p_post_id and p.status = 'published';
end;
$$;

revoke all on function public.update_published_post_editorial(uuid, text)
  from public, anon, authenticated;
grant execute on function public.update_published_post_editorial(uuid, text)
  to service_role;
