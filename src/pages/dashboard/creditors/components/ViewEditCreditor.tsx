import { ViewUpdateCreditorForm } from "./ViewUpdateCreditorForm";
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquareMousePointer } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export function ViewEditCreditor() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="bg-slate-200 hover:bg-slate-400">
          <SquareMousePointer className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="w-1000">
        <SheetHeader>
          <SheetTitle>Creditor Details</SheetTitle>
          <SheetDescription>
            View or save changes to the creditor here
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-10" />
        <ViewUpdateCreditorForm />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
