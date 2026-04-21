import React from "react";
import type { ExamTable } from "@/types/exam-schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { cn } from "@/lib/utils";

interface TableViewProps {
  table: ExamTable;
}

function getCellClass(content: string): string {
  if (content === "○") return "font-bold text-success";
  if (content === "×") return "font-bold text-destructive";
  return " leading-snug break-keep whitespace-normal";
}

const TableView: React.FC<TableViewProps> = ({ table }) => {
  return (
    <Table>
      {table.caption && <caption className="sr-only">{table.caption}</caption>}
      <TableHeader>
        {table.headers.map((headerRow, ri) => (
          <TableRow key={ri} className="bg-muted/60 hover:bg-muted/60">
            {headerRow.cells.map((cell, ci) => (
              <TableHead
                key={ci}
                colSpan={cell.colSpan ?? 1}
                rowSpan={cell.rowSpan ?? 1}
                className={cn("border-border border text-center font-bold")}
              >
                {cell.content}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.rows.map((row, ri) => (
          <TableRow key={ri}>
            {row.cells.map((cell, ci) => (
              <TableCell
                key={ci}
                colSpan={cell.colSpan ?? 1}
                rowSpan={cell.rowSpan ?? 1}
                className={cn(
                  "border-border border text-center",
                  getCellClass(cell.content),
                )}
              >
                {cell.content}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableView;
