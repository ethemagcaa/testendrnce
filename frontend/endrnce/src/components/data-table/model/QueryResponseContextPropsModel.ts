import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";

export type QueryResponseContextPropsModel<T> = {
    response?: QueryResponseModel<Array<T>> | undefined
    refetch: () => void
    isLoading: boolean
    query: string
}
