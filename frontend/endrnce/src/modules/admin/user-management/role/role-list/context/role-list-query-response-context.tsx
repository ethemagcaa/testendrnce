import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { RoleQueryModel } from "@modules/admin/user-management/role/role-list/model/RoleQueryModel";
import { roleService } from "@services/RoleService";

const RoleListQueryResponseContext = createResponseContext<RoleQueryModel>(initialQueryResponse);

const RoleListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getUsers = async (query: string): Promise<QueryResponseModel<RoleQueryModel[]>> => {
        return await roleService.getInstance().getRoles(query);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.rolesList, query],
        queryFn: () => getUsers(query)
    });

    return (
        <RoleListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </RoleListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(RoleListQueryResponseContext);

const useRoleListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useRoleListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useRoleListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useRoleQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();

    return isLoading;
};

export {
    RoleListQueryResponseProvider,
    RoleListQueryResponseContext,
    useRoleListQueryResponseData,
    useRoleListPageCountData,
    useRoleListTotalRows,
    useRoleQueryResponseLoading
};
