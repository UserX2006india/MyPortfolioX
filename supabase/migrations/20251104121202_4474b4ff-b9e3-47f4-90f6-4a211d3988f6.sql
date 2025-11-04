-- Add support for multiple images and videos per project
ALTER TABLE public.projects
ADD COLUMN additional_images text[] DEFAULT ARRAY[]::text[],
ADD COLUMN video_links text[] DEFAULT ARRAY[]::text[];

COMMENT ON COLUMN public.projects.media_url IS 'Main thumbnail image for the project';
COMMENT ON COLUMN public.projects.additional_images IS 'Array of additional image URLs to display in project detail view';
COMMENT ON COLUMN public.projects.video_links IS 'Array of YouTube/Vimeo video URLs to embed in project detail view';