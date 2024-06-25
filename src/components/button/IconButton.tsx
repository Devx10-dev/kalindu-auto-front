import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { IconButtonProps } from "@/types/component/propTypes";

function IconButton({
  icon,
  tooltipMsg,
  handleOnClick,
  variant,
  disabled,
}: IconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="table-cell-btn"
            variant={variant ?? "ghost"}
            onClick={handleOnClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="tooltip-msg">{tooltipMsg}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default IconButton;
