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
    <section id="experience" className="py-20 px-6 bg-secondary/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4">Experience</h2>
          <p className="text-muted-foreground text-lg">
            My professional journey in creative design
          </p>
        </div>

        <div className="space-y-8">
          {experiences?.map((exp, index) => (
            <div 
              key={exp.id}
              className="glass rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{exp.job_title}</h3>
                      <p className="text-lg text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-sm font-medium glass px-4 py-2 rounded-full">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
