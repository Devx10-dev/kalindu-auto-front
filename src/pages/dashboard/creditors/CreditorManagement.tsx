import { useState } from "react";
import CreditorsTable from "./components/CreditorsTable";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorService from "./api/CreditorAPI";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import TablePagination from "@/components/TablePagination";

export default function CreditorManagement() {
    const axiosPrivate = useAxiosPrivate();
    const creditorService = new CreditorService(axiosPrivate);
    const queryClient = useQueryClient();
    const [pageNo, setPageNo] = useState(0);

    const { isLoading, data } = useQuery({
        queryKey: ['creditors', pageNo],
        queryFn: () => creditorService.fetchCreditors(pageNo),
    });

    const onPageChange = (pageNo: number) => {
        setPageNo(pageNo);
        queryClient.invalidateQueries({ queryKey: ['creditors'] });
    };

    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <h2 className="mb-4 text-2xl font-bold">Creditor Management</h2>
            <CreditorsTable creditorData={data?.creditors}/>
            <TablePagination pageNo={data?.page} totalPages={data?.totalPages} onPageChange={onPageChange}/>
        </>
    );
}
