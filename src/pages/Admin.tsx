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
import { CVManager } from "@/components/admin/CVManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
            <TabsTrigger value="social">Social Links</TabsTrigger>
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
            <CVManager />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialLinksManager />
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
