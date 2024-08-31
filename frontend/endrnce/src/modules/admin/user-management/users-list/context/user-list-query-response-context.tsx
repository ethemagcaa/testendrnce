import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { userService } from "@services/UserService";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { UserQueryResponseModel } from "@services/model/payload/response/user/UserQueryResponseModel";

const UserListQueryResponseContext = createResponseContext<UserQueryResponseModel>(initialQueryResponse);

const UserListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getUsers = async (query: string): Promise<QueryResponseModel<UserQueryResponseModel[]>> => {
        return await userService.getInstance().getUsers(query);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.usersList, query],
        queryFn: () => getUsers(query)
    });

    return (
        <UserListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </UserListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(UserListQueryResponseContext);

const useUserListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useUserListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useUserListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useUserQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();

    return isLoading;
};

export {
    UserListQueryResponseProvider,
    UserListQueryResponseContext,
    useUserListQueryResponseData,
    useUserListPageCountData,
    useUserListTotalRows,
    useUserQueryResponseLoading
};
