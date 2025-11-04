-- Add profile_image_url to profiles table for admin to manage hero image
ALTER TABLE public.profiles
ADD COLUMN profile_image_url text;