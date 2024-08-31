import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@react-query/constants/query-keys";
import { WithChildren } from "@library/Types";
import { healthCheckService } from "@services/HealthCheckService";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { HealthCheckQueryModel } from "@modules/main/health-check/model/HealthCheckQueryModel";

const HealthCheckListQueryResponseContext = createResponseContext<HealthCheckQueryModel>(initialQueryResponse);

const HealthCheckListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getHealthCheckQuery = async (query: string): Promise<QueryResponseModel<HealthCheckQueryModel[]>> => {
        return await healthCheckService.getInstance().getHealthCheckQuery(query);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.healthCheckList, query],
        queryFn: () => getHealthCheckQuery(query)
    });

    return (
        <HealthCheckListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </HealthCheckListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(HealthCheckListQueryResponseContext);

const useHealthCheckListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useHealthCheckListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useHealthCheckListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useHealthCheckListQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();

    return isLoading;
};

export {
    HealthCheckListQueryResponseProvider,
    HealthCheckListQueryResponseContext,
    useHealthCheckListQueryResponseData,
    useHealthCheckListPageCountData,
    useHealthCheckListTotalRows,
    useHealthCheckListQueryResponseLoading
};
