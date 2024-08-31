
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { healthCheckService } from "@services/HealthCheckService";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { EnvironmentQueryResponseModel } from "@services/model/payload/response/health-check/EnvironmentQueryResponseModel";

const EnvironmentListQueryResponseContext = createResponseContext<EnvironmentQueryResponseModel>(initialQueryResponse);

const EnvironmentListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getEnvironmentQuery = async (query: string): Promise<QueryResponseModel<EnvironmentQueryResponseModel[]>> => {
        return await healthCheckService.getInstance().getEnvironmentQuery(query);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.environmentList, query],
        queryFn: () => getEnvironmentQuery(query)
    });

    return (
        <EnvironmentListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </EnvironmentListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(EnvironmentListQueryResponseContext);

const useEnvironmentListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useEnvironmentListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useEnvironmentListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useEnvironmentListQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();

    return isLoading;
};

export {
    EnvironmentListQueryResponseProvider,
    EnvironmentListQueryResponseContext,
    useEnvironmentListQueryResponseData,
    useEnvironmentListPageCountData,
    useEnvironmentListTotalRows,
    useEnvironmentListQueryResponseLoading
};
