import TablePagination from "@/components/TablePagination";
import PageHeader from "@/components/card/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useQuery } from "@tanstack/react-query";
import { Search, Settings2 } from "lucide-react";
import { useState } from "react";
import CreditorAPI from "./api/CreditorAPI";
import CreditorsTable from "./components/CreditorsTable";
import { ResetIcon } from "@radix-ui/react-icons";

export default function CreditorManagement() {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const [pageNo, setPageNo] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchQuery = useDebounce(searchInput, 1000);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["creditors", pageNo, debouncedSearchQuery],
    queryFn: () => creditorAPI.fetchCreditors(pageNo, debouncedSearchQuery, 10),
  });

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPageNo(0);
  };

  const handleReset = () => {
    setSearchInput("");
    setPageNo(0);
  };

  const onPageChange = (newPageNo) => {
    setPageNo(newPageNo);
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-10">
      <PageHeader
        title="Creditor Management"
        description="View and manage all the creditor data and transactions"
        icon={<Settings2 height="30" width="28" color="#162a3b" />}
      />
      
      {/* search creditor */}
      <div className="mb-4 flex gap-5 w-1/2">
        <Input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search creditor name"
        />
        <Button variant={"secondary"} onClick={() => refetch()}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button variant={"secondary"} onClick={handleReset}>
          <ResetIcon className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* creditor data table */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <CreditorsTable creditorData={data?.creditors} />
      )}

      {/* pagination */}
      <div className="mt-10">
        <TablePagination
          pageNo={data?.page}
          totalPages={data?.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
