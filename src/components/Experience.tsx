import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase } from "lucide-react";

export const Experience = () => {
  const { data: experiences } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="experience" className="py-16 sm:py-20 px-4 sm:px-6 bg-secondary/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">Experience</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            My professional journey in creative design
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {experiences?.map((exp, index) => (
            <div 
              key={exp.id}
              className="glass rounded-xl sm:rounded-2xl p-5 sm:p-8 hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold">{exp.job_title}</h3>
                      <p className="text-base sm:text-lg text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-medium glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full self-start whitespace-nowrap">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm sm:text-base text-muted-foreground">{exp.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
