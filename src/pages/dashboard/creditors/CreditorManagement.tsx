import Loading from "@/components/Loading";
import TablePagination from "@/components/TablePagination";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CreditorAPI from "./api/CreditorAPI";
import CreditorsTable from "./components/CreditorsTable";

export default function CreditorManagement() {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const [pageNo, setPageNo] = useState(0);

  const { isLoading, data } = useQuery({
    queryKey: ["creditors", pageNo],
    queryFn: () => creditorAPI.fetchCreditors(pageNo),
  });

  const onPageChange = (pageNo: number) => {
    setPageNo(pageNo);
    queryClient.invalidateQueries({ queryKey: ["creditors"] });
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Creditor Management</h2>
      <CreditorsTable creditorData={data?.creditors} />
      <TablePagination
        pageNo={data?.page}
        totalPages={data?.totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
