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
import { ReloadIcon } from "@radix-ui/react-icons";
import { CheckSquareIcon } from "lucide-react";

export function SettlementModal({
  show,
  title,
  onClose,
  onSettle,
  onReject,
  settleCheckMutation,
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
            <Button
              onClick={onReject}
              variant="destructive"
              disabled={settleCheckMutation?.isPending ? true : false}
              size="sm"
            >
              Rejected
            </Button>
            <div className="d-flex gap-2">
              <Button
                onClick={onClose}
                variant="secondary"
                disabled={settleCheckMutation?.isPending ? true : false}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={onSettle}
                variant="default"
                disabled={settleCheckMutation?.isPending ? true : false}
                size="sm"
              >
                {settleCheckMutation?.isPending ? (
                  <ReloadIcon className="mr-2 h-5 w-5" />
                ) : (
                  <CheckSquareIcon className="mr-2 h-5 w-5" />
                )}
                {settleCheckMutation?.isPending ? "Settling" : "Settle"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
