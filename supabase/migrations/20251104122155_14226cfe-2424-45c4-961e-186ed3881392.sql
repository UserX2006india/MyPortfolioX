-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for CV bucket
CREATE POLICY "Public can view CV files"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can upload CV files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cvs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update CV files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cvs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete CV files"
ON storage.objects FOR DELETE
USING (bucket_id = 'cvs' AND auth.role() = 'authenticated');