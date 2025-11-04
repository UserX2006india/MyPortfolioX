import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ProjectDialogProps {
  project: {
    title: string;
    description: string;
    media_url: string;
    media_type?: string;
    tags?: string[];
    project_url?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog = ({ project, open, onOpenChange }: ProjectDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {project.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Project Media */}
          <div className="aspect-video overflow-hidden rounded-xl bg-muted">
            {project.media_type === "image" || !project.media_type ? (
              <img 
                src={project.media_url} 
                alt={project.title}
                className="w-full h-full object-cover"
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

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-sm px-4 py-2 rounded-full glass font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Project Link */}
          {project.project_url && (
            <Button 
              className="w-full glass" 
              size="lg"
              asChild
            >
              <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                View Live Project
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
