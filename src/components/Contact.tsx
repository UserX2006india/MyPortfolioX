import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Linkedin, Instagram, Github, Mail, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    contact_number: "",
    email: ""
  });
  const { data: profile } = useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("cv_url, social_links")
        .single();
      if (error) throw error;
      return {
        cv_url: data.cv_url,
        social_links: data.social_links as SocialLinks
      };
    }
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
      const {
        error
      } = await supabase.from("contact_messages").insert([formData]);
      if (error) throw error;
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailRevealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailFormData.contact_number.trim() || !emailFormData.email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: "Email Request",
          email: emailFormData.email,
          message: `Contact Number: ${emailFormData.contact_number}`
        }]);

      if (error) throw error;

      setEmailRevealed(true);
      setShowEmailDialog(false);
      toast.success("Email revealed! Thank you for sharing your details.");
    } catch (error) {
      toast.error("Failed to process request. Please try again.");
    }
  };
  return <section id="contact" className="py-20 px-6 bg-secondary/30">
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
                  <Input placeholder="Your Name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} required className="glass" />
                </div>
                <div>
                  <Input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required className="glass" />
                </div>
                <div>
                  <Textarea placeholder="Your Message" value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} required className="glass min-h-[150px]" />
                </div>
                <Button type="submit" className="w-full glass" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass border-none">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {emailRevealed ? (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <a href="mailto:govindkumarkharbade@gmail.com" className="hover:text-accent transition-colors">
                        govindkumarkharbade@gmail.com
                      </a>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setShowEmailDialog(true)} 
                      className="w-full glass"
                      variant="outline"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Get My Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogContent className="glass">
                <DialogHeader>
                  <DialogTitle>Get Email Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEmailRevealSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="tel"
                      placeholder="Your Contact Number"
                      value={emailFormData.contact_number}
                      onChange={(e) => setEmailFormData({
                        ...emailFormData,
                        contact_number: e.target.value
                      })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={emailFormData.email}
                      onChange={(e) => setEmailFormData({
                        ...emailFormData,
                        email: e.target.value
                      })}
                      required
                      className="glass"
                    />
                  </div>
                  <Button type="submit" className="w-full glass">
                    Submit & Get Email
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Card className="glass border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Connect With Me</h3>
                <div className="flex gap-4">
                  {profile?.social_links?.linkedin && (
                    <Button variant="outline" size="icon" className="glass" asChild>
                      <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </Button>
                  )}
                  {profile?.social_links?.instagram && (
                    <Button variant="outline" size="icon" className="glass" asChild>
                      <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-5 h-5" />
                      </a>
                    </Button>
                  )}
                  {profile?.social_links?.github && (
                    <Button variant="outline" size="icon" className="glass" asChild>
                      <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Download CV</h3>
                <Button variant="outline" className="glass w-full" onClick={handleDownloadCV} disabled={!profile?.cv_url}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};