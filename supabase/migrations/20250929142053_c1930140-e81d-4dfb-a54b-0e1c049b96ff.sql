-- Fix storage policies for 'user-images' bucket: drop-if-exists then create

-- Public read
drop policy if exists "Public can view user-images" on storage.objects;
create policy "Public can view user-images"
on storage.objects
for select
using (
  bucket_id = 'user-images'
);

-- Insert (upload) to own folder
drop policy if exists "Users can upload to their own folder in user-images" on storage.objects;
create policy "Users can upload to their own folder in user-images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Update own files
drop policy if exists "Users can update files in their own folder in user-images" on storage.objects;
create policy "Users can update files in their own folder in user-images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'user-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'user-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete own files
drop policy if exists "Users can delete files in their own folder in user-images" on storage.objects;
create policy "Users can delete files in their own folder in user-images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
