import { Button } from "@/components/ui/button";
import heroImage from "@/assets/profile-person.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("cv_url, profile_image_url, full_name, tagline")
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 pt-24 sm:pt-32 relative overflow-hidden">
      <div className="container max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in order-2 lg:order-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">👋</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
                  Hello! <span className="font-bold">I'm {profile?.full_name || "Govind"}</span>
                </h1>
                <div className="h-px w-32 sm:w-40 bg-foreground my-3 sm:my-4" />
                <div className="flex items-center gap-3">
                  <p className="text-lg sm:text-xl lg:text-2xl">{profile?.tagline || "Creative Designer"}</p>
                  <span className="text-xl sm:text-2xl">✦</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 max-w-lg leading-relaxed">
              Hello! I'm {profile?.full_name || "Govind"}. I'm a <strong>UX leader, design thinker, creative designer,</strong> experience strategist, generative artist & human-loving introvert
            </p>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg sm:text-xl mt-0.5 sm:mt-1">✓</span>
                <p className="text-sm sm:text-base">Product must be authentic</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg sm:text-xl mt-0.5 sm:mt-1">✓</span>
                <p className="text-sm sm:text-base">Solve pain points elegantly</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg sm:text-xl mt-0.5 sm:mt-1">✓</span>
                <p className="text-sm sm:text-base">User testing, feedback, and validation</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:scale-105 transition-transform"
                onClick={() => scrollToSection("contact")}
              >
                Let's Talk
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:scale-105 transition-transform border-b-2 border-foreground"
                onClick={() => profile?.cv_url ? window.open(profile.cv_url, '_blank') : null}
                disabled={!profile?.cv_url}
              >
                Download CV ↓
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-up order-1 lg:order-2">
            <div className="relative">
              <img 
                src={profile?.profile_image_url || heroImage} 
                alt={profile?.full_name || "Govind Kharbade"} 
                className="w-full h-auto rounded-2xl sm:rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: '600px' }}
              />
              <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 bg-foreground text-background rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-xl">
                <span className="text-xl sm:text-2xl font-light">Hello</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
