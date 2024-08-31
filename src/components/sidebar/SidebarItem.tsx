"use client";

import * as React from "react";
import { ChevronRight, ChevronsDown, ChevronsUp, UserIcon } from "lucide-react";

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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 mb-10"
    >
      <div className="flex items-center justify-between border-b-2 font-bold text-2xl mx-5 w-[210px]">
        <div className="flex gap-3 items-center">
          {props.link.icon}
          <h4 className="text-lg font-medium text-gray-800">
            {props.link.label}
          </h4>
        </div>

        <CollapsibleTrigger asChild>
          <Button size={"sm"} variant={"ghost"} className="w-10 h-5">
            {isOpen ? (
              <ChevronsUp className="h-4 w-4" />
            ) : (
              <ChevronsDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {props.link.sublinks && (
          <ul className="ml-2 w-[210px]">
            {props.link.sublinks.map((sublink) => (
              <li key={sublink.label} className="h-[40px] w-[215px]">
                <Link to={sublink.href}>
                  <div className="flex gap-2 items-center pl-4">
                    <ChevronRight size={10} />
                    <p
                      className={`h-[36px] rounded-md px-3 py-3 fs-15 color-40 font-medium ${
                        location.pathname.includes(sublink.href)
                          ? " bg-slate-300"
                          : "hover:bg-slate-200"
                      } rounded-md flex items-center gap-1`}
                    >
                      {sublink.label}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
