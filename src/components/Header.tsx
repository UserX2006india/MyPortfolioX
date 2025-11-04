import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Header = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="container max-w-7xl mx-auto flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className="text-xl font-light border-b-2 border-foreground pb-1 inline-block">
            it's me
          </h2>
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" className="flex flex-col items-start h-auto py-4 px-6 rounded-3xl hover:scale-105 transition-transform" onClick={() => scrollToSection("work")}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base">My Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground text-left">
              See all of nice project
              <br />i have done.
            </span>
          </Button>

          <Button variant="secondary" className="flex flex-col items-start h-auto py-4 px-6 rounded-3xl hover:scale-105 transition-transform" onClick={() => scrollToSection("services")}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base">About Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground text-left">
              Learn about my self
              <br />
              what i do
            </span>
          </Button>

          <Button variant="secondary" className="flex flex-col items-start h-auto py-4 px-6 rounded-3xl hover:scale-105 transition-transform" onClick={() => scrollToSection("contact")}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base">Contact me</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground text-left">contact me to decide our next project</span>
          </Button>
        </div>
      </div>
    </header>;
};