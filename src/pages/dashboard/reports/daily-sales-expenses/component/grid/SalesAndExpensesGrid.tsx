import Loading from "@/components/Loading";
import IconButton from "@/components/button/IconButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaleOrExpense } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { EditIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState, Fragment } from "react";

export default function SalesAndExpensesGrid({
  salesOrExpenses,
}: {
  salesOrExpenses: SaleOrExpense[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prevExpandedCategories) =>
      prevExpandedCategories.includes(categoryName)
        ? prevExpandedCategories.filter((name) => name !== categoryName)
        : [...prevExpandedCategories, categoryName]
    );
  };

  // Group expenses by category
  const groupedExpenses = salesOrExpenses.reduce((groups, expense) => {
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
                  groupedExpenses[categoryName].map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.field.name}</TableCell>
                      <TableCell>
                        <p
                          className="pl-2 pr-2"
                          style={{
                            background: expense.expense ? "#dc3545" : "#198754",
                            color: "#fff",
                            borderRadius: 5,
                            maxWidth: "max-content",
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          {expense.expense ? "Expense" : "Sale"}
                        </p>
                      </TableCell>
                      <TableCell>{expense.amount}</TableCell>
                      <TableCell>{expense.dateTime}</TableCell>
                      <TableCell>{expense.reason}</TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </Fragment>
  );
}
