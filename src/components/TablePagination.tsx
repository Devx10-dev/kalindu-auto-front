import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function TablePagination(props: {
  pageNo?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}) {
  const { pageNo = 1, pageSize = 10, totalPages = 1 } = props;
  const [currentPage, setCurrentPage] = useState(pageNo);

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
                props.onPageChange?.(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (
        (i === currentPage - 3 && currentPage > 4) ||
        (i === currentPage + 3 && currentPage < totalPages - 3)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    return pages;
  };

  return (
    <Pagination className="w-min ml-1000">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            isActive={currentPage != 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                props.onPageChange?.(currentPage - 1);
              }
            }}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                props.onPageChange?.(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
