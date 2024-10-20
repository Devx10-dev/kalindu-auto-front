import React, { forwardRef } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { IconButtonProps } from "@/types/component/propTypes";

// Use forwardRef with HTMLButtonElement type for ref
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, tooltipMsg, handleOnClick, variant, disabled }: IconButtonProps,
    ref
  ) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref} // Pass ref here with correct typing
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
);

export default IconButton;
