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

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  const isVideoUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || 
           url.includes('vimeo.com') || url.includes('embed');
  };

  const showVideo = project.project_url && isVideoUrl(project.project_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {project.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Project Thumbnail Image */}
          <div className="aspect-video overflow-hidden rounded-xl bg-muted shadow-lg">
            <img 
              src={project.media_url} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Video Embed (if video URL provided) */}
          {showVideo && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Project Video</h3>
              <div className="aspect-video overflow-hidden rounded-xl bg-muted shadow-lg">
                <iframe
                  src={getEmbedUrl(project.project_url)}
                  title={`${project.title} - Video`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

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

          {/* Project Link - Only show if not a video URL */}
          {project.project_url && !showVideo && (
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