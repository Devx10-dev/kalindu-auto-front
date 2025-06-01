"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Bell, LogOut, Settings, User } from "lucide-react";

export default function DropDownSwitch({
  variant,
  label,
  icon,
  outsourced,
  setOutSourced,
}: {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  outsourced?: boolean;
  setOutSourced?: (value: boolean) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} className="p-0">
            {label}
            {icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex cursor-default items-center justify-between">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Outsourced</span>
            </div>
            <Switch checked={outsourced} onCheckedChange={setOutSourced} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
