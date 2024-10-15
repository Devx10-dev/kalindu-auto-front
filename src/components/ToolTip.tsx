import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function ToolTip({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p>{message}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p style={{ maxWidth: "250px", textWrap: "wrap", padding: "8px" }}>
            {description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ToolTip;
