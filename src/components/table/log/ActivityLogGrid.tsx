import { MOBILE_SCREEN_WIDTH } from "@/components/sidebar/Sidebar";
import TablePagination from "@/components/TablePagination";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { TableBodySkeleton } from "@/pages/dashboard/invoice/view-invoices/components/TableSkeleton";
import { ActivityLogService } from "@/service/activityLog/activityLogService";
import {
  ActivityLog,
  ActivityLogsResponseData,
} from "@/types/log/activityLogTypes";
import dateArrayToString from "@/utils/dateArrayToString";
import { formatDateToISO } from "@/utils/dateTime";
import { toNormalCase, truncate } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// TODO: Add pagination to the grid
function ActivityLogGrid({
  activityLogService,
}: {
  activityLogService: ActivityLogService;
}) {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedDBAction, setSelectedDBAction] = useState<string | null>(null);
  const [selectedFromDate, setSelectedFromDate] = useState<string | null>(null);
  const [selectedToDate, setSelectedToDate] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    function checkScreenWidth() {
      setIsMobileView(window.innerWidth < MOBILE_SCREEN_WIDTH + 200);
    }

    // Initial check
    checkScreenWidth();

    // Listen for screen resize events
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const { data: userIDs } = useQuery<string[]>({
    queryKey: ["userIDs"],
    queryFn: () => activityLogService.fetchUserIds(),
  });

  const { data: features } = useQuery<string[]>({
    queryKey: ["features"],
    queryFn: () => activityLogService.fetchFeatures(),
  });

  const { data: actions } = useQuery<string[]>({
    queryKey: ["actions"],
    queryFn: () => activityLogService.fetchActions(),
  });

  const {
    isLoading,
    data: activityLogs,
    refetch,
  } = useQuery<ActivityLogsResponseData>({
    queryKey: ["activityLogs", debouncedSearchQuery, pageNo],
    queryFn: () =>
      activityLogService.fetchActivityLogs(
        pageNo,
        pageSize,
        selectedUsername ?? "All",
        selectedFeature ?? "All",
        selectedDBAction ?? "All",
        selectedFromDate,
        selectedToDate,
        debouncedSearchQuery
      ),
  });

  const [viewActivityLogs, setViewActivityLogs] = useState<ActivityLog[]>(
    activityLogs?.activityLogs ?? []
  );

  useEffect(() => {
    setViewActivityLogs(activityLogs?.activityLogs ?? []);
  }, [activityLogs]);

  const refetchActivityLogs = () => {
    refetch();
  };

  const setDateRange = (dateRange: DateRange | undefined) => {
    if (dateRange !== undefined) {
      if (dateRange.from !== undefined) {
        setSelectedFromDate(formatDateToISO(dateRange.from));
      }
      if (dateRange.to !== undefined) {
        setSelectedToDate(formatDateToISO(dateRange.to));
      }
    }
  };

  useEffect(() => {
    setDateRange(date);
  }, [date]);

  useEffect(() => {
    if (activityLogs) {
      setTotalPages(activityLogs.totalPages);
    }
  }, [activityLogs]);

  return (
    <Fragment>
      <>
        <div
          className="d-flex gap-3 mb-4 p-4"
          style={{
            borderRadius: "5px",
            boxShadow:
              "rgba(255, 255, 255, 0.1) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.20) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          <Input
            style={{ flex: 2 }}
            value={searchQuery ?? undefined}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search ..."
          />
          <div
            style={{ display: `${isMobileView ? "none" : "flex"}` }}
            className="gap-2"
          >
            <div style={{ flex: 2 }}>
              <Select
                onValueChange={(value) => setSelectedUsername(value)}
                value={selectedUsername ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user ID" />
                </SelectTrigger>
                <SelectContent>
                  {userIDs !== undefined &&
                    ["All", ...userIDs]?.map((userID) => (
                      <SelectItem key={Math.random()} value={userID}>
                        {userID}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ flex: 2 }}>
              <Select
                onValueChange={(value) => setSelectedFeature(value)}
                value={selectedFeature ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  {features !== undefined &&
                    ["All", ...features]?.map((feature) => (
                      <SelectItem key={Math.random()} value={feature}>
                        {toNormalCase(feature)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ flex: 2 }}>
              <Select
                onValueChange={(value) => setSelectedDBAction(value)}
                value={selectedDBAction ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actions !== undefined &&
                    ["All", ...actions]?.map((action) => (
                      <SelectItem key={Math.random()} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="gap-2 flex-2">
            <Button variant={"default"} onClick={refetchActivityLogs}>
              Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <Table className="border rounded-md text-md mb-5 min-w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Done at</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableBodySkeleton cols={6} rows={10} />
            ) : (
              <TableBody>
                {viewActivityLogs &&
                  viewActivityLogs.map((activityLog) => (
                    <TableRow key={activityLog.id}>
                      <TableCell>{activityLog.id}</TableCell>
                      <TableCell>
                        <ToolTip
                          description={activityLog.doneBy}
                          message={truncate(activityLog.doneBy, 20)}
                        />
                      </TableCell>
                      <TableCell>{toNormalCase(activityLog.feature)}</TableCell>
                      <TableCell>
                        {toNormalCase(activityLog.dbaction)}
                      </TableCell>
                      <TableCell>
                        {dateArrayToString(activityLog.doneAt)}
                      </TableCell>
                      <TableCell>
                        <ToolTip
                          description={activityLog.description}
                          message={truncate(activityLog.description, 30)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
            <TableCaption>Activity Logs</TableCaption>
          </Table>
        </div>
        <div className="mt-5">
          <TablePagination
            pageNo={pageNo + 1}
            totalPages={totalPages}
            onPageChange={(page) => {
              setPageNo(page - 1);
            }}
          />
        </div>
      </>
    </Fragment>
  );
}

export default ActivityLogGrid;
