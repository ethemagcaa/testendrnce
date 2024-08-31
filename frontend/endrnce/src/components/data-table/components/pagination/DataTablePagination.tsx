import React  from "react";
import clsx from "clsx";
import { paginate } from "@components/data-table/core/helpers";
import { Table } from "@tanstack/react-table";
import { FormattedMessage } from "react-intl";

type Props = {
    table: Table<object>,
    totalRows: number,
    isLoading: boolean
}

const DataTablePagination: React.FC<Props> = ({ table, totalRows, isLoading }) => {

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPageCount = table.getPageCount();

    if(totalPageCount <= 0)
        return <></>;

    const pages: number[] = paginate(currentPage, totalPageCount).pages;

    return (
        <div className='row'>
            <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'>
                <select
                    className="form-select form-select-sm form-select-solid"
                    style={{ width: "auto" }}
                    aria-label="Select page size"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 25, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <label className={"px-2"}>
                    <FormattedMessage
                        id="Show records | Total <b>{totalRows}</b> record{totalRowsSuffix} found"
                        values={{
                            b: (...chunks) => <b>{chunks}</b>,
                            totalRows: totalRows,
                            totalRowsSuffix: totalRows > 1 ? "s": ""
                        }}
                    />
                </label>
            </div>
            <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                <div id='kt_table_users_paginate'>
                    <ul className='pagination'>

                        <li
                            className={clsx("page-item", {
                                disabled: isLoading || !table.getCanPreviousPage(),
                            })}
                        >
                            <a
                                onClick={() => table.setPageIndex(0)}
                                role="presentation"
                                style={{ cursor: "pointer" }}
                                className='page-link'
                            >
                                <FormattedMessage id="First" />
                            </a>
                        </li>
                        <li
                            className={clsx("page-item", {
                                disabled: isLoading || !table.getCanPreviousPage(),
                            })}
                        >
                            <a
                                onClick={() => table.previousPage()}
                                role="presentation"
                                style={{ cursor: "pointer" }}
                                className='page-link'
                            >
                                <FormattedMessage id="Previous" />
                            </a>
                        </li>

                        {pages.map((pageIndex) => (
                            <li
                                key={pageIndex - 1}
                                className={clsx("page-item", {
                                    active: currentPage === pageIndex,
                                    disabled: isLoading,
                                })}
                            >
                                <a
                                    className={clsx("page-link")}
                                    role="presentation"
                                    onClick={() => table.setPageIndex(pageIndex - 1)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {pageIndex}
                                </a>
                            </li>
                        ))}

                        <li
                            className={clsx("page-item", {
                                disabled: isLoading || !table.getCanNextPage(),
                            })}
                        >
                            <a
                                onClick={() => table.nextPage()}
                                role="presentation"
                                style={{ cursor: "pointer" }}
                                className='page-link'
                            >
                                <FormattedMessage id="Next" />
                            </a>
                        </li>
                        <li
                            className={clsx("page-item", {
                                disabled: isLoading || !table.getCanNextPage(),
                            })}
                        >
                            <a
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                role="presentation"
                                style={{ cursor: "pointer" }}
                                className='page-link'
                            >
                                <FormattedMessage id="Last" />
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
};

export { DataTablePagination };
