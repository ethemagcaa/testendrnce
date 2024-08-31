export type QueryResponseModel<T> = {
    data: Array<T>
    pageCount?: number
    totalRows: number
}
