import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash, Edit } from "lucide-react";

export const ProjectManager = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_url: "",
    project_url: "",
    tags: "",
    additional_images: "",
    video_links: "",
  });

  const { data: projects, refetch } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        media_url: formData.media_url,
        project_url: formData.project_url,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        additional_images: formData.additional_images.split("\n").map(url => url.trim()).filter(Boolean),
        video_links: formData.video_links.split("\n").map(url => url.trim()).filter(Boolean),
      };

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Project updated!");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);
        if (error) throw error;
        toast.success("Project added!");
        setIsAdding(false);
      }
      setFormData({ title: "", description: "", media_url: "", project_url: "", tags: "", additional_images: "", video_links: "" });
      refetch();
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      media_url: project.media_url,
      project_url: project.project_url || "",
      tags: project.tags?.join(", ") || "",
      additional_images: project.additional_images?.join("\n") || "",
      video_links: project.video_links?.join("\n") || "",
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", description: "", media_url: "", project_url: "", tags: "", additional_images: "", video_links: "" });
  };

  return (
    <div className="space-y-6">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="glass">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      )}

      {isAdding && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="media_url">Project Thumbnail Image URL</Label>
                <Input
                  id="media_url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  className="glass"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Main project thumbnail (shown in grid and detail view)
                </p>
              </div>
              <div>
                <Label htmlFor="project_url">Project/Video URL (Optional)</Label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="YouTube/Vimeo URL or live project link"
                  className="glass"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube: https://youtube.com/watch?v=... | Vimeo: https://vimeo.com/... | Or any live project URL
                </p>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="UI/UX, Web Design, Branding"
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="additional_images">Additional Images (one URL per line)</Label>
                <Textarea
                  id="additional_images"
                  value={formData.additional_images}
                  onChange={(e) => setFormData({ ...formData, additional_images: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                  className="glass"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add multiple project images - one URL per line
                </p>
              </div>
              <div>
                <Label htmlFor="video_links">Video Links (one URL per line)</Label>
                <Textarea
                  id="video_links"
                  value={formData.video_links}
                  onChange={(e) => setFormData({ ...formData, video_links: e.target.value })}
                  placeholder="https://youtube.com/watch?v=...&#10;https://vimeo.com/..."
                  className="glass"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add YouTube or Vimeo video URLs - one per line
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="glass">
                  {editingId ? "Update" : "Add"} Project
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="glass">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Existing Projects</h3>
        {projects?.map((project) => (
          <Card key={project.id} className="glass">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold">{project.title}</h4>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                  {project.project_url && (
                    <a 
                      href={project.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {project.project_url}
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
