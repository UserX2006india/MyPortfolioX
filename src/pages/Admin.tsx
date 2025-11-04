import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    media_url: "",
    tags: "",
  });
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const { data: projects, refetch: refetchProjects } = useQuery({
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("projects").insert([{
        ...newProject,
        tags: newProject.tags.split(",").map(tag => tag.trim()),
      }]);
      if (error) throw error;
      toast.success("Project added successfully!");
      setNewProject({ title: "", description: "", media_url: "", tags: "" });
      refetchProjects();
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted");
      refetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleUpdateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ cv_url: cvUrl })
        .eq("id", user.id);
      
      if (error) throw error;
      toast.success("CV link updated successfully!");
      setCvUrl("");
    } catch (error) {
      toast.error("Failed to update CV link");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="cv">CV Settings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="media_url">Media URL (Image or YouTube/Vimeo link)</Label>
                    <Input
                      id="media_url"
                      value={newProject.media_url}
                      onChange={(e) => setNewProject({ ...newProject, media_url: e.target.value })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      placeholder="UI/UX, Web Design, Branding"
                      className="glass"
                    />
                  </div>
                  <Button type="submit" className="glass">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Existing Projects</h3>
              {projects?.map((project) => (
                <Card key={project.id} className="glass">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold">{project.title}</h4>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cv">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Update CV Link</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateCV} className="space-y-4">
                  <div>
                    <Label htmlFor="cv_url">CV URL (Google Drive, Dropbox, etc.)</Label>
                    <Input
                      id="cv_url"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      required
                      className="glass"
                    />
                  </div>
                  <Button type="submit" className="glass">
                    Update CV Link
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Contact messages will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
