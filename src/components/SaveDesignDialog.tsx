import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { saveBuildPlan } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";

interface SaveDesignDialogProps {
  onSave: (name: string, description: string) => void;
  defaultName?: string;
  defaultDescription?: string;
  buildPlan?: any;
  isUpdate?: boolean;
}

const SaveDesignDialog = ({
  onSave,
  defaultName = "",
  defaultDescription = "",
  buildPlan,
  isUpdate = false,
}: SaveDesignDialogProps) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (name.trim()) {
      setIsSaving(true);
      try {
        // Call onSave to update local state
        onSave(name, description);

        // If we have a buildPlan, save it to the database
        if (buildPlan) {
          const updatedPlan = {
            ...buildPlan,
            planName: name,
            designBrief: {
              ...buildPlan.designBrief,
              description: description,
            },
          };

          const savedPlan = await saveBuildPlan(updatedPlan);

          if (savedPlan) {
            toast({
              title: isUpdate ? "Design Updated" : "Design Saved",
              description: `${name} has been ${isUpdate ? "updated" : "saved"} successfully.`,
            });
          } else {
            toast({
              title: "Error",
              description: `Failed to ${isUpdate ? "update" : "save"} design. Please try again.`,
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error saving design:", error);
        toast({
          title: "Error",
          description: `An unexpected error occurred while ${isUpdate ? "updating" : "saving"} your design.`,
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {isUpdate ? "Update" : "Save"} Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update" : "Save"} Design</DialogTitle>
          <DialogDescription>
            {isUpdate ? "Update" : "Save"} your current furniture design for
            future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="My Furniture Design"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="A brief description of your design..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {isUpdate ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>{isUpdate ? "Update" : "Save"} Design</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDesignDialog;
