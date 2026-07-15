-- Harden gallery storage write access: restrict INSERT/UPDATE/DELETE to authenticated users.
-- Reverts the fully-open "Anyone can ..." policies (migration 20260209171726) that let
-- any anon caller upload, overwrite or delete gallery objects. Public SELECT is unchanged.
DROP POLICY IF EXISTS "Anyone can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON storage.objects;
CREATE POLICY "Authenticated can upload gallery images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update gallery images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete gallery images"
  ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
