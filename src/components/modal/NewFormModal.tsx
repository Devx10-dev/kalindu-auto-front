import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormModalProps } from "@/types/component/propTypes";
import { Button } from "../ui/button";

export function NewFormModal({
  show,
  title,
  titleDescription,
  component,
  buttonIcon,
  buttonTitle,
  dialogFooter,
  setShow,
}: FormModalProps) {
  return (
    <Dialog open={show}>
      <DialogTrigger onClick={() => setShow(true)}>
        <Button variant="default" size="sm">
          {buttonIcon ? buttonIcon : null}
          {buttonTitle ? buttonTitle : "Open"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%] p-5 remove-close !rounded-lg">
        <DialogHeader className="rounded-t-lg">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="">{titleDescription}</DialogDescription>
        </DialogHeader>
        {component}
        {/* <DialogFooter>
          {dialogFooter ? dialogFooter : null}
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
