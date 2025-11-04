import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Linkedin, Instagram, Github } from "lucide-react";

interface SocialLinks {
  linkedin: string;
  instagram: string;
  github: string;
}

export const SocialLinksManager = () => {
  const [links, setLinks] = useState<SocialLinks>({
    linkedin: "",
    instagram: "",
    github: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("social_links")
        .single();

      if (error) throw error;
      
      if (data?.social_links) {
        const socialLinks = data.social_links as Record<string, string>;
        setLinks({
          linkedin: socialLinks.linkedin || "",
          instagram: socialLinks.instagram || "",
          github: socialLinks.github || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load social links");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ social_links: links as any })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Social links updated successfully!");
    } catch (error) {
      toast.error("Failed to update social links");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              value={links.linkedin}
              onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/your-profile"
              className="glass"
            />
          </div>

          <div>
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Instagram URL
            </Label>
            <Input
              id="instagram"
              value={links.instagram}
              onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
              placeholder="https://instagram.com/your-profile"
              className="glass"
            />
          </div>

          <div>
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub URL
            </Label>
            <Input
              id="github"
              value={links.github}
              onChange={(e) => setLinks({ ...links, github: e.target.value })}
              placeholder="https://github.com/your-profile"
              className="glass"
            />
          </div>

          <Button type="submit" className="glass w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Update Social Links"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
