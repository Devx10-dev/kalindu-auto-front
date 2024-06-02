import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormModalProps } from "@/types/component/propTypes";

export function FormModal({
  show,
  title,
  titleDescription,
  component,
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
      </DialogContent>
    </Dialog>
  );
}
