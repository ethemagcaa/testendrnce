/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useState, createContext, useEffect, useMemo } from "react";

import { WithChildren } from "@library/Types";
import { DataTableContextPropsModel } from "@components/data-table/model/DataTableContextPropsModel";
import { initialQueryState, QueryStateModel, SortState } from "@components/data-table/model/QueryStateModel";
import { SortingState } from "@tanstack/table-core/src/features/Sorting";
import { ColumnDef, getCoreRowModel, getSortedRowModel, PaginationState, useReactTable } from "@tanstack/react-table";

const initialQueryRequest: DataTableContextPropsModel = {
    state: initialQueryState,
    updateState: () => {},
    updatePagination: () => {},
    // @ts-ignore
    table: {},
    setDatas: () => {},
    setColumn: () => {},
    setPageCounter: () => {},
};

const DataTableContext = createContext<DataTableContextPropsModel>(initialQueryRequest);

const DataTableProvider: FC<WithChildren> = ({ children }) => {
    const [state, setState] = useState<QueryStateModel>(initialQueryRequest.state);
    const [pageCount, setPageCount] = useState<number>(0);
    const [data, setData] = useState<object[]>([]);
    const [columns, setColumns] = useState<ColumnDef<object, string>[]>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialQueryRequest.state.items_per_page,
    });

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    useEffect(() => {
        let updatedState: QueryStateModel;

        if(sorting?.length == 1) {
            const sort: SortState = {
                sort: sorting[0].id,
                order: sorting[0].desc ? "desc" : "asc"
            };

            updatedState = { ...state, ...sort } as QueryStateModel;
        } else {
            state.sort = undefined;
            state.order = undefined;
            updatedState = { ...state } as QueryStateModel;
        }

        setState(updatedState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);

    useEffect(() => {
        const updatedState = { ...state  } as QueryStateModel;
        updatedState.page = pagination?.pageIndex ? pagination?.pageIndex + 1 : 1;
        updatedState.items_per_page = pagination?.pageSize ?? 10;

        setState(updatedState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            columnVisibility,
        },
        pageCount,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        manualSorting: true,
        manualPagination: true,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        debugTable: false //process.env.NODE_ENV !== "production",
    });

    const setDatas = (data: object[] | undefined) => {
        if(data)
            setData(data);
    };

    const setColumn = (data: ColumnDef<object, string>[]) => {
        setColumns(data);
    };

    const setPageCounter = (counter: number) => {
        setPageCount(counter);
    };

    const updateState = (updates: Partial<QueryStateModel>) => {
        const updatedState = { ...state, ...updates } as QueryStateModel;
        setState(updatedState);
    };

    const updatePagination = (pagination: PaginationState) => {
        setPagination(pagination);
    };

    return (
        // @ts-ignore
        <DataTableContext.Provider value={{ state, table, setDatas, setColumn, setPageCounter, updateState, updatePagination }}>
            {children}
        </DataTableContext.Provider>
    );
};

export { DataTableProvider, DataTableContext };
