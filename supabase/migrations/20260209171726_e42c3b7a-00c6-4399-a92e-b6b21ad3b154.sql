
-- Drop old restrictive upload/delete policies
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

-- Allow anyone to upload to gallery
CREATE POLICY "Anyone can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

-- Allow anyone to update gallery images
CREATE POLICY "Anyone can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery');

-- Allow anyone to delete gallery images
CREATE POLICY "Anyone can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');
