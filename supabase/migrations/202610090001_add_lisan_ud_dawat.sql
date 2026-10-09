-- Add 'Lisan ud-Dawat' to posts language check constraint
alter table public.posts drop constraint if exists posts_language_check;
alter table public.posts add constraint posts_language_check check (language in ('English', 'Urdu', 'Lisan ud-Dawat'));
