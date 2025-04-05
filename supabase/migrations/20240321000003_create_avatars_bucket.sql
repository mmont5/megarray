-- Create a storage bucket for user avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Set file size limits (5MB max)
update storage.buckets
set file_size_limit = 5242880
where id = 'avatars';

-- Set allowed mime types
update storage.buckets
set allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
where id = 'avatars';

-- Set up storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
    and (storage.foldername(name))[2] = 'avatar.' || substring(lower(storage.extension(name)) from 1 for 5)
    and array_length(storage.foldername(name), 1) = 2
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
    and (storage.foldername(name))[2] = 'avatar.' || substring(lower(storage.extension(name)) from 1 for 5)
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add event trigger for logging avatar changes
create table if not exists public.avatar_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  operation text not null,
  file_path text not null,
  created_at timestamptz default now() not null
);

-- RLS for avatar logs
alter table public.avatar_logs enable row level security;

create policy "Users can view their own avatar logs"
  on public.avatar_logs for select
  using (auth.uid() = user_id);

create or replace function public.log_avatar_changes()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.avatar_logs (user_id, operation, file_path)
    values (
      (storage.foldername(NEW.name))[1]::uuid,
      TG_OP,
      NEW.name
    );
  elsif (TG_OP = 'UPDATE') then
    insert into public.avatar_logs (user_id, operation, file_path)
    values (
      (storage.foldername(NEW.name))[1]::uuid,
      TG_OP,
      NEW.name
    );
  elsif (TG_OP = 'DELETE') then
    insert into public.avatar_logs (user_id, operation, file_path)
    values (
      (storage.foldername(OLD.name))[1]::uuid,
      TG_OP,
      OLD.name
    );
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_avatar_change
  after insert or update or delete on storage.objects
  for each row
  when (OLD.bucket_id = 'avatars' or NEW.bucket_id = 'avatars')
  execute procedure public.log_avatar_changes(); 