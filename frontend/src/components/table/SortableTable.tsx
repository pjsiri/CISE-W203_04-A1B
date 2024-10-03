import React from "react";

interface SortableTableProps<T> {
  headers: { key: keyof T; label: string }[];
  data: T[];
}

const SortableTable = <T,>({ headers, data }: SortableTableProps<T>) => (
  <table>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.key as string}>{header.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {headers.map((header) => (
            <td key={header.key as string}>{String(row[header.key])}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SortableTable;