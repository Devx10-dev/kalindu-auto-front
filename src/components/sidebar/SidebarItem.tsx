"use client";

import * as React from "react";
import { ChevronsDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/types/sidebar";

export function SidebarItem(props: { link: NavLink }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation();
  console.log(location.pathname);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 mb-10"
    >
      <div className="flex items-center justify-between border-b-2 font-bold text-2xl mx-5">
        <h4 className="text-xl font-semibold ">{props.link.label}</h4>
        <CollapsibleTrigger asChild>
          <Button size={"sm"} variant={"ghost"} className="w-10 h-5">
            <ChevronsDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {props.link.sublinks && (
          <ul className="ml-2 ">
            {props.link.sublinks.map((sublink) => (
              <li key={sublink.label}>
                <Link to={sublink.href}>
                  <p
                    className={`rounded-md px-4 py-3 mt-2 text-md ${
                      location.pathname.includes(sublink.href)
                        ? " bg-slate-300 p-1"
                        : "hover:bg-slate-200 p-1"
                    } rounded-md flex items-center gap-1`}
                  >
                    {/* {sublink.icon} */}
                    {sublink.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
