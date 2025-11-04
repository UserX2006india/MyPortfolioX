import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { AdminLoginDialog } from "./AdminLoginDialog";

export const AdminButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-6 right-6 glass rounded-full w-12 h-12 z-50 opacity-30 hover:opacity-100 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="w-5 h-5" />
      </Button>
      <AdminLoginDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
