import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormModalProps } from "@/types/component/propTypes";

export function FormModal({
  show,
  onClose,
  title,
  titleDescription,
  component,
  onSubmit,
}: FormModalProps) {
  return (
    <Dialog open={show}>
      <DialogContent className="sm:max-w-[60%] p-5 remove-close">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="fs-15">
            {titleDescription}
          </DialogDescription>
        </DialogHeader>
        {component}
        <DialogFooter className="mt-3">
          <Button onClick={onClose} variant={"outline"}>
            Cancel
          </Button>
          <div style={{ borderLeft: "3px solid #555", padding: "1px" }} />
          <Button onClick={onClose} variant={"outline"}>
            Reset
          </Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
