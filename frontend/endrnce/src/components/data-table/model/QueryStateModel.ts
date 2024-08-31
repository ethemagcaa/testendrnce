/* eslint-disable @typescript-eslint/no-explicit-any */
export type QueryStateModel = PaginationState & SortState & SearchState & FilterState

export type PaginationState = {
    page: number
    items_per_page: number
}

export type SearchState = {
    search?: string
}

export type SortState = {
    sort?: string
    order?: "asc" | "desc"
}

export type FilterState = {
    filter?: any
}

export const initialQueryState: QueryStateModel = {
    page: 1,
    items_per_page: 10,
};
