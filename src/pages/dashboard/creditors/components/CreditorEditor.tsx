import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, UserRoundCog } from "lucide-react";
import { RegisterForm } from "./CreditorForm";
import { CreditorEditorForm } from "./CreditorEditorForm";

export default function CreditorEditor({ creditor }: { creditor: any }) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant={"outline"} className="w-fit p-2">
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Creditor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Edit Creditor</DialogTitle>
          <DialogDescription>
            Edit the necessary creditor details and hit save
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 pb-0">
          <CreditorEditorForm isEditMode={true} creditor={creditor} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
