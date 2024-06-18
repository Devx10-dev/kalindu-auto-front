import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COnfirmationModalProps } from "@/types/component/propTypes";
import { Button } from "../ui/button";

export function ConfirmationModal({
  show,
  title,
  titleDescription,
  onClose,
  onConfirm,
}: COnfirmationModalProps) {
  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="fs-15">
            {titleDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div>
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="destructive">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
