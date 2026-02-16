
-- Create storage bucket for OG images
INSERT INTO storage.buckets (id, name, public) VALUES ('og-images', 'og-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "OG images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');
