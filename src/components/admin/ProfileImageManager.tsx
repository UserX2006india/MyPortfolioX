import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const ProfileImageManager = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", user.id);
      
      if (error) throw error;
      toast.success("Profile image updated successfully!");
      setImageUrl("");
    } catch (error) {
      toast.error("Failed to update profile image");
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Update Profile Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateImage} className="space-y-4">
          <div>
            <Label htmlFor="image_url">Image URL (Transparent PNG recommended)</Label>
            <Input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/profile-image.png"
              required
              className="glass"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Use a transparent background PNG for best results. Upload to services like Imgur or use direct image links.
            </p>
          </div>
          <Button type="submit" className="glass">
            Update Profile Image
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
