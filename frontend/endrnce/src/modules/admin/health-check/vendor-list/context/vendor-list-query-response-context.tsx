import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { healthCheckService } from "@services/HealthCheckService";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";

import { VendorQueryResponseModel } from "@services/model/payload/response/health-check/VendorQueryResponseModel";

const VendorListQueryResponseContext = createResponseContext<VendorQueryResponseModel>(initialQueryResponse);

const VendorListQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getVendorQuery = async (query: string): Promise<QueryResponseModel<VendorQueryResponseModel[]>> => {
        return await healthCheckService.getInstance().getVendorQuery(query);
    };

    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [queryKeys.vendorList, query],
        queryFn: () => getVendorQuery(query)
    });

    return (
        <VendorListQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </VendorListQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(VendorListQueryResponseContext);

const useVendorListQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useVendorListPageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useVendorListTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useVendorListQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();

    return isLoading;
};

export {
    VendorListQueryResponseProvider,
    VendorListQueryResponseContext,
    useVendorListQueryResponseData,
    useVendorListPageCountData,
    useVendorListTotalRows,
    useVendorListQueryResponseLoading
};
