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
      <DialogContent className="grid-modal w-[95vw] h-[90vh] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[60%] overflow-hidden p-0">
        <div className="h-full flex flex-col">
          <DialogHeader className="p-5 border-b">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            {titleDescription && (
              <DialogDescription className="fs-15 mt-1.5">
                {titleDescription}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-auto p-5">{component}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GridModal;
