import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const CVManager = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile-cv"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("cv_url")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is PDF
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete old CV if exists
      if (profile?.cv_url) {
        const oldPath = profile.cv_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("cvs").remove([oldPath]);
        }
      }

      // Upload new CV
      const fileName = `cv-${user.id}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("cvs")
        .getPublicUrl(fileName);

      // Update profile with new CV URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cv_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("CV uploaded successfully!");
      setFile(null);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>CV Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="cv_file">Upload CV (PDF only, max 5MB)</Label>
            <Input
              id="cv_file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="glass cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>
          <Button type="submit" className="glass" disabled={uploading || !file}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload CV"}
          </Button>
        </form>

        {profile?.cv_url && (
          <div className="pt-4 border-t border-border">
            <Label className="mb-2 block">Current CV</Label>
            <Button
              variant="outline"
              className="glass"
              asChild
            >
              <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Current CV
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
