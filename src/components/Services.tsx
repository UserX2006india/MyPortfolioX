import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Palette, Eye, Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap: Record<string, any> = {
  Palette,
  Eye,
  Megaphone,
};

export const Services = () => {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="services" className="py-20 px-6">
      <div className="container max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4">What I'm Offering</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive design solutions tailored to bring your vision to life
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services?.map((service, index) => {
            const Icon = iconMap[service.icon_name || "Palette"];
            return (
              <Card 
                key={service.id} 
                className="glass border-none hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
