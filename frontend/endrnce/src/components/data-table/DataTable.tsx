/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import {
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Loading } from "@components/loading/Loading";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { FormattedMessage } from "react-intl";

type Props = {
    data: object[] | undefined,
    columns: ColumnDef<any, string>[],
    pageCount: number,
    isLoading?: boolean
}

const DataTable: React.FC<Props> = ({ data, columns, pageCount, isLoading }) => {
    const { table, setDatas, setColumn, setPageCounter } = useContext(DataTableContext);

    useEffect(() => {
        if (setDatas && setColumn && setPageCounter) {
            setDatas(data);
            setColumn(columns);
            setPageCounter(pageCount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, columns, pageCount]);

    return (
        <>
            <div className="table-responsive">
                <table
                    id="kt_table_users"
                    className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                >
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}
                                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}
                                        colSpan={header.colSpan}
                                        className={clsx(
                                            "min-w-125px"
                                        )}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                                onKeyDown={header.column.getToggleSortingHandler()}
                                                className={clsx(
                                                    header.column.getCanSort() && "cursor-pointer",
                                                    header.column.getIsSorted() && `table-sort-${header.column.getIsSorted() as string}`
                                                )}
                                                role="presentation"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="text-gray-600 fw-bold">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={table.getHeaderGroups()[0].headers.length}>
                                    <div
                                        className="d-flex text-center w-100 align-content-center justify-content-center">
                                        <FormattedMessage id="No matching records found" />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isLoading && <Loading/>}
        </>
    );
};

export { DataTable };
