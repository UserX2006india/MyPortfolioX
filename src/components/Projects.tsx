import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectDialog } from "@/components/ProjectDialog";

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <>
      <ProjectDialog 
        project={selectedProject}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      
      <section id="work" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">Case Studies</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
              A selection of projects that showcase my creative approach and problem-solving skills
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {projects?.map((project, index) => (
              <Card 
                key={project.id}
                className="glass border-none overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleProjectClick(project)}
              >
                <div className="aspect-video overflow-hidden bg-muted relative">
                  {project.media_type === "image" || !project.media_type ? (
                    <img 
                      src={project.media_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <iframe
                        src={project.media_url}
                        title={project.title}
                        className="w-full h-full pointer-events-none"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 sm:pb-8">
                    <span className="text-white font-semibold text-sm sm:text-lg">Click to view details</span>
                  </div>
                </div>
                <CardContent className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2.5 sm:px-3 py-1 rounded-full bg-secondary/60 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs px-2.5 sm:px-3 py-1 rounded-full bg-secondary/60 backdrop-blur-sm">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {(!projects || projects.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
