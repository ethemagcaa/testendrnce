/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryStateModel } from "@components/data-table/model/QueryStateModel";
import { SortingState } from "@tanstack/table-core/src/features/Sorting";
import { ColumnDef, PaginationState, Table } from "@tanstack/react-table";

export type DataTableContextPropsModel = {
    state: QueryStateModel
    updateState: (updates: Partial<QueryStateModel>) => void
    table: Table<object>
    sortingColumn?: SortingState
    updatePagination?: (pagination: PaginationState) => void
    setDatas?: (data: object[] | undefined) => void
    setColumn?: (columns: ColumnDef<any, string>[]) => void
    setPageCounter?: (count: number) => void
}
