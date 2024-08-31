import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { healthCheckService } from "@services/HealthCheckService";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { EndpointQueryResponseModel } from "@services/model/payload/response/health-check/EndpointQueryResponseModel";

const EndpointListQueryResponseContext = createResponseContext<EndpointQueryResponseModel>(initialQueryResponse);

const EndpointListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);
    const { vendorId } = useParams<{ vendorId: string }>();

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getEndpointQuery = async (query: string, vendorId: number): Promise<QueryResponseModel<EndpointQueryResponseModel[]>> => {
        return await healthCheckService.getInstance().getEndpointQuery(query, vendorId);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.endpointList, query, vendorId],
        queryFn: () => getEndpointQuery(query, Number(vendorId))
    });

    return (
        <EndpointListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </EndpointListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(EndpointListQueryResponseContext);

const useEndpointListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useEndpointListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useEndpointListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useEndpointListQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();
    return isLoading;
};

export {
    EndpointListQueryResponseProvider,
    EndpointListQueryResponseContext,
    useEndpointListQueryResponseData,
    useEndpointListPageCountData,
    useEndpointListTotalRows,
    useEndpointListQueryResponseLoading
};
