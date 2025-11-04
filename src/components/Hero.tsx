import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
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
        .select("cv_url")
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 pt-32 relative overflow-hidden">
      {/* Colorful gradient blob */}
      <div 
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-60 blur-3xl"
        style={{ background: 'var(--gradient-colorful)' }}
      />
      
      <div className="container max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl lg:text-6xl font-light">
                  Hello! <span className="font-bold">I'm Govind</span>
                </h1>
                <div className="h-px w-40 bg-foreground my-4" />
                <div className="flex items-center gap-3">
                  <p className="text-xl lg:text-2xl">Creative Designer</p>
                  <span className="text-2xl">✦</span>
                </div>
              </div>
            </div>
            
            <p className="text-base text-foreground/80 max-w-lg leading-relaxed">
              Hello! I'm Govind. I'm a <strong>UX leader, design thinker, creative designer,</strong> experience strategist, generative artist & human-loving introvert
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">✓</span>
                <p className="text-base">Product must be authentic</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">✓</span>
                <p className="text-base">Solve pain points elegantly</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">✓</span>
                <p className="text-base">User testing, feedback, and validation</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base hover:scale-105 transition-transform"
                onClick={() => scrollToSection("contact")}
              >
                Let's Talk
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                className="rounded-full px-8 py-6 text-base hover:scale-105 transition-transform border-b-2 border-foreground"
                onClick={() => profile?.cv_url ? window.open(profile.cv_url, '_blank') : null}
                disabled={!profile?.cv_url}
              >
                Download CV ↓
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Govind Kharbade" 
                className="w-full h-auto rounded-3xl"
              />
              <div className="absolute bottom-10 left-10 bg-foreground text-background rounded-full w-32 h-32 flex items-center justify-center">
                <span className="text-2xl font-light">Hello</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
