create table if not exists public.post_submission_originals (
  post_id uuid primary key references public.posts(id) on delete cascade,
  original_submission jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.post_submission_originals enable row level security;
revoke all on table public.post_submission_originals from public, anon, authenticated;
grant all on table public.post_submission_originals to service_role;

create or replace function public.edit_pending_post(
  p_post_id uuid,
  p_editor_id uuid,
  p_title text,
  p_content text,
  p_category text,
  p_language text,
  p_author_name text,
  p_class_name text,
  p_section text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_post public.posts%rowtype;
  updated_post jsonb;
  original_snapshot jsonb;
begin
  if p_editor_id is null then
    raise exception 'An authenticated editor is required';
  end if;

  select * into current_post
  from public.posts
  where id = p_post_id and status = 'pending'
  for update;

  if not found then
    return null;
  end if;

  insert into public.post_submission_originals (post_id, original_submission)
  values (
    p_post_id,
    jsonb_build_object(
      'captured_at', now(),
      'captured_by', p_editor_id,
      'student_id', current_post.student_id,
      'title', current_post.title,
      'content', current_post.content,
      'category', current_post.category,
      'language', current_post.language,
      'author_name', current_post.author_name,
      'class_name', current_post.class_name,
      'section', current_post.section,
      'cover_image', current_post.cover_image,
      'submitted_at', current_post.submitted_at
    )
  )
  on conflict (post_id) do nothing;

  select original_submission into original_snapshot
  from public.post_submission_originals
  where post_id = p_post_id;

  update public.posts p
  set title = p_title,
      content = p_content,
      category = p_category,
      language = p_language,
      author_name = p_author_name,
      class_name = p_class_name,
      section = p_section
  where p.id = p_post_id and p.status = 'pending'
  returning to_jsonb(p) into updated_post;

  return jsonb_build_object('post', updated_post, 'original_submission', original_snapshot);
end;
$$;

revoke all on function public.edit_pending_post(uuid, uuid, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.edit_pending_post(uuid, uuid, text, text, text, text, text, text, text)
  to service_role;
