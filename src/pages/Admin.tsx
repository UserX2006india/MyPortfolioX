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
import { LogOut } from "lucide-react";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { ProfileImageManager } from "@/components/admin/ProfileImageManager";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="glass">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="profile">Profile Image</TabsTrigger>
            <TabsTrigger value="cv">CV Settings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6 mt-6">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6 mt-6">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <ProfileImageManager />
          </TabsContent>

          <TabsContent value="cv" className="mt-6">
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

          <TabsContent value="messages" className="mt-6">
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
