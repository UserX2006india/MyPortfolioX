import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash, Edit } from "lucide-react";

export const ExperienceManager = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    job_title: "",
    company: "",
    duration: "",
    description: "",
  });

  const { data: experiences, refetch } = useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from("experience")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Experience updated!");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("experience")
          .insert([formData]);
        if (error) throw error;
        toast.success("Experience added!");
        setIsAdding(false);
      }
      setFormData({ job_title: "", company: "", duration: "", description: "" });
      refetch();
    } catch (error) {
      toast.error("Failed to save experience");
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({
      job_title: exp.job_title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description || "",
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
      toast.success("Experience deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ job_title: "", company: "", duration: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="glass">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      )}

      {isAdding && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Experience" : "Add New Experience"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  required
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 2020 - 2023"
                  required
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="glass">
                  {editingId ? "Update" : "Add"} Experience
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="glass">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Existing Experience</h3>
        {experiences?.map((exp) => (
          <Card key={exp.id} className="glass">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold">{exp.job_title}</h4>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>
                  {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(exp)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(exp.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
