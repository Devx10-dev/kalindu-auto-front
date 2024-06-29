import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChequeSettleModalProps } from "@/types/component/propTypes";

export function SettlementModal({
  show,
  title,
  onClose,
  onSettle,
  onReject,
}: ChequeSettleModalProps) {
  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="fs-15">
            {
              "If the cheque is settled then click on the settled button to continue. Otherwise continue with the rejected button."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="d-flex justify-between w-full">
            <Button onClick={onReject} variant="destructive">
              Rejected
            </Button>
            <div className="d-flex gap-2">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button onClick={onSettle}>Settled</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
