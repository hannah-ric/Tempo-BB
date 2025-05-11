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
import { Share2, Copy, Check, Download } from "lucide-react";

interface ShareDesignDialogProps {
  designId?: string;
  designName?: string;
  onExport?: () => void;
}

const ShareDesignDialog = ({
  designId = "design-123",
  designName = "My Furniture Design",
  onExport = () => {},
}: ShareDesignDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Generate a shareable link (this would be a real URL in production)
  const shareableLink = `https://furniture-designer.example.com/designs/${designId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Design
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Design</DialogTitle>
          <DialogDescription>
            Share your "{designName}" design with others or export it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Link
            </Label>
            <div className="col-span-3 flex">
              <Input
                id="link"
                value={shareableLink}
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="secondary"
                className="rounded-l-none px-3"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Export</Label>
            <div className="col-span-3">
              <Button variant="outline" className="w-full" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Build Plan (PDF)
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDesignDialog;
