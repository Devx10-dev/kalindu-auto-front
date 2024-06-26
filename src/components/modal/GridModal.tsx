import { FormModalProps } from "@/types/component/propTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

function GridModal({
  show,
  title,
  titleDescription,
  component,
}: FormModalProps) {
  return (
    <Dialog open={show}>
      <DialogContent className="sm:max-w-[75%] p-5 remove-close">
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

export default GridModal;
