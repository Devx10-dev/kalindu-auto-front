"use client";
("use client");

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CreditorsService } from "@/service/creditor/CreditorsService";
import { Creditor } from "@/types/creditor/creditorTypes";
import CreditorListCard from "./CreditorListCard";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreditorsListSkeleton from "./CreditorListSkeleton";
import AllCaughtUp from "./AllCaughtUp";

export default function CreditorCard({
  className,
}: {
  // type of the className prop
  className?: string;
}) {
  const [creditorType, setCreditorType] = useState("overdue");
  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(
    null,
  );

  const axiosPrivate = useAxiosPrivate();
  const creditorsService = new CreditorsService(axiosPrivate);
  const popupButtonRef = useRef<HTMLButtonElement>(null);

  const {
    data: overdueCreditors,
    isLoading: overdueCreditorsLoading,
    error: overdueCreditorsError,
  } = useQuery<Creditor[], Error>({
    queryKey: ["overdueCreditors"],
    queryFn: () => creditorsService.fetchOverdueCreditors(),
  });

  useEffect(() => {
    if (overdueCreditors) {
      console.log(overdueCreditors);
    }
  }, [overdueCreditors]);

  // i neded to capture the clicked id and pass it to the dialog
  function handleCreditorClick(key) {
    popupButtonRef.current?.click();

    if (creditorType === "overdue") {
      setSelectedCreditor(
        overdueCreditors["overdue"].find(
          (creditor) => creditor.creditorID === key,
        ),
      );
    } else {
      setSelectedCreditor(
        overdueCreditors["due"].find((creditor) => creditor.creditorID === key),
      );
    }
  }

  useEffect(() => {
    if (selectedCreditor) {
      console.log(selectedCreditor);
    }
  }, [selectedCreditor]);

  return (
    <div className={className}>
      <Card x-chunk="dashboard-01-chunk-5" className="h-full max-h-[500px]">
        <div className="flex h-[20%] justify-between items-center align-items-top p-6">
          <CardHeader className="p-0 h-[100%]  flex flex-col">
            <CardTitle className="pl-0">Creditors</CardTitle>
            <CardDescription className="pl-0">
              Latest due and overdue creditors
            </CardDescription>
          </CardHeader>
          <div className="gap-2 pt-0 flex">
            <Select value={creditorType} onValueChange={setCreditorType}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="flex h-[350px]">
          <div className=" flex-row w-full h-full overflow-auto">
            {overdueCreditorsLoading ? (
              <CreditorsListSkeleton load_count={6} />
            ) : overdueCreditors ? (
              overdueCreditors
                ?.filter(
                  (creditor) =>
                    creditor.dueStatus?.toLowerCase() === creditorType,
                )
                .map((creditor) => (
                  <div
                    key={creditor.creditorID}
                    onClick={() => handleCreditorClick(creditor.creditorID)}
                  >
                    <CreditorListCard creditorDetails={creditor} />
                    <Separator className="my-2" />
                  </div>
                ))
            ) : (
              <AllCaughtUp caughtUpText="All caught up!" />
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild className="hidden">
          <Button
            ref={popupButtonRef}
            className="hidden"
            variant="outline"
            hidden={true}
          >
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400]">
          <div className="grid gap-4 py-4">
            <div className="flex justify-start gap-5">
              <div className="">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={
                      "https://avatar.iran.liara.run/username?username=" +
                      selectedCreditor?.shopName.split(" ").join("+")
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    {selectedCreditor?.shopName
                      .split(" ")
                      .map((word) => word[0].toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="">
                <div className="grid-col-4 gap-5">
                  <p className="text-xl font-medium leading-none col-span-4">
                    {selectedCreditor?.shopName}
                  </p>
                  <div className="col-span-2">
                    {selectedCreditor?.overdueInvoiceCount > 0 && (
                      <Badge className="w-fit" variant="destructive">
                        {selectedCreditor?.overdueInvoiceCount} overdue
                      </Badge>
                    )}
                    {selectedCreditor?.dueInvoiceCount > 0 && (
                      <Badge className="ml-2 w-fit" variant="outline">
                        {" "}
                        {selectedCreditor?.dueInvoiceCount} due
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
