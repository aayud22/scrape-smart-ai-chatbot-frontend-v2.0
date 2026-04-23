import React from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  align?: "left" | "right" | "center";
}
