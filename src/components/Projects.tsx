import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const Projects = () => {
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

  return (
    <section id="work" className="py-20 px-6">
      <div className="container max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4">Case Studies</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of projects that showcase my creative approach and problem-solving skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects?.map((project, index) => (
            <Card 
              key={project.id}
              className="glass border-none overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {project.media_type === "image" ? (
                  <img 
                    src={project.media_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <iframe
                    src={project.media_url}
                    title={project.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full bg-secondary/60 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.project_url && (
                  <Button 
                    variant="outline" 
                    className="glass w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" 
                    asChild
                  >
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                      View Project
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
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
  );
};
