import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Linkedin, Instagram, Github, Mail, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile-cv"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("cv_url")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleDownloadCV = () => {
    if (profile?.cv_url) {
      window.open(profile.cv_url, "_blank");
    } else {
      toast.error("CV not available");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-secondary/30">
      <div className="container max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4">Say Hi! 👋</h2>
          <p className="text-muted-foreground text-lg">
            Tell me about your idea
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass border-none">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="glass"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="glass"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="glass min-h-[150px]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full glass"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass border-none">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <a href="mailto:govindofficials06@gmail.com" className="hover:text-accent transition-colors">
                      govindofficials06@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Connect With Me</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="glass" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="glass" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="glass" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Download CV</h3>
                <Button 
                  variant="outline" 
                  className="glass w-full"
                  onClick={handleDownloadCV}
                  disabled={!profile?.cv_url}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
