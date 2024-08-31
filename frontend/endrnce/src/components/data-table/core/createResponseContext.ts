import { createContext } from "react";

import { QueryResponseContextPropsModel } from "@components/data-table/model/QueryResponseContextPropsModel";

const initialQueryResponse = {
    refetch: () => {},
    isLoading: false,
    query: ""
};

const createResponseContext = <T>(initialState: QueryResponseContextPropsModel<T>) => {
    return createContext(initialState);
};

export { createResponseContext, initialQueryResponse };
