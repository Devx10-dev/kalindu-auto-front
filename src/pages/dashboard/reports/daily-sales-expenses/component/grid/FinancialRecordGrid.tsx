import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialRecord } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { convertSnakeCaseToNormalCase } from "@/utils/string";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { record } from "zod";

export default function FinancialRecordGrid({
  financialRecords,
}: {
  financialRecords: FinancialRecord[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    financialRecords.map((record) => record.field.category.name),
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prevExpandedCategories) =>
      prevExpandedCategories.includes(categoryName)
        ? prevExpandedCategories.filter((name) => name !== categoryName)
        : [...prevExpandedCategories, categoryName],
    );
  };

  // Group expenses by category
  const groupedExpenses = financialRecords.reduce((groups, expense) => {
    const categoryName = expense.field.category.name;
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(expense);
    return groups;
  }, {});

  return (
    <Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto ">
          <Table className="border rounded-md text-md mb-5 table-responsive">
            <TableCaption>Daily sales and expenses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead align="center">Type</TableHead>
                <TableHead align="right">Amount</TableHead>
                <TableHead>Date Time</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groupedExpenses).map((categoryName) => (
                <Fragment key={categoryName}>
                  <TableRow
                    onClick={() => toggleCategory(categoryName)}
                    className="cursor-pointer bg-gray-200"
                  >
                    <TableCell
                      colSpan={6}
                      className="font-bold flex items-center"
                    >
                      {expandedCategories.includes(categoryName) ? (
                        <ChevronDownIcon className="mr-2" />
                      ) : (
                        <ChevronRightIcon className="mr-2" />
                      )}
                      {`Category - ${categoryName}`}
                    </TableCell>
                  </TableRow>
                  {expandedCategories.includes(categoryName) &&
                    groupedExpenses[categoryName].map(
                      (financialRecord: FinancialRecord) => (
                        <TableRow key={financialRecord.id}>
                          <TableCell>{financialRecord.field.name}</TableCell>
                          <TableCell>
                            <p
                              className="pl-2 pr-2"
                              style={{
                                background:
                                  financialRecord.type === "EXPENSE"
                                    ? "#dc3545"
                                    : financialRecord.type === "SALE"
                                      ? "#198754"
                                      : financialRecord.type ===
                                          "CREDIT_BALANCE"
                                        ? "#ffc107"
                                        : "#6c757d",
                                color: "#fff",
                                borderRadius: 5,
                                maxWidth: "max-content",
                                fontSize: 12,
                                fontWeight: 400,
                              }}
                            >
                              {convertSnakeCaseToNormalCase(
                                financialRecord.type,
                              )}
                            </p>
                          </TableCell>
                          <TableCell>{financialRecord.amount}</TableCell>
                          <TableCell>{`${financialRecord.dateTime[0]}-${financialRecord.dateTime[1]}-${financialRecord.dateTime[2]} ${financialRecord.dateTime[3]}:${financialRecord.dateTime[4]}:${financialRecord.dateTime[5]}`}</TableCell>
                          <TableCell>{financialRecord.reason}</TableCell>
                        </TableRow>
                      ),
                    )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Fragment>
  );
}
