import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WithChildren } from "@library/Types";
import { queryKeys } from "@react-query/constants/query-keys";
import { createResponseContext, initialQueryResponse } from "@components/data-table/core/createResponseContext";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { UserQueryResponseModel } from "@services/model/payload/response/user/UserQueryResponseModel";
import { cucumberService } from "@services/CucumberService";
import { stringifyRequestQuery } from "@components/data-table/core/helpers";
import { ServerTypeContext } from "@modules/main/dashboards/cucumber-board/context/server-type-context";
import { JobNameContext } from "@modules/main/dashboards/cucumber-board/context/job-name-context";

const TestCaseQueryResponseContext = createResponseContext<UserQueryResponseModel>(initialQueryResponse);

const TestCaseQueryResponseProvider: FC<WithChildren> = ({ children }) => {
    const { state } = useContext(DataTableContext);
    const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
    const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);
    const { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly } = useContext(ServerTypeContext);
    const { jobName } = useContext(JobNameContext);

    useEffect(() => {
        if (query !== updatedQuery)
            setQuery(updatedQuery);
    }, [updatedQuery, query]);

    const getUsers = async (query: string): Promise<QueryResponseModel<UserQueryResponseModel[]>> => {
        return await cucumberService.getInstance().getTestCaseQuery(query,
            { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly }, jobName);
    };


    const {
        data: response,
        isLoading,
        refetch
    } = useQuery({
        queryKey: [isEnterprise ?
            queryKeys.usersListEnterprise : (isExcludeEnterpriseBsg ?
                queryKeys.usersListExcludeEnterpriseBsg : (isBsgOnly ?
                    queryKeys.usersListBsgOnly : (jobName ?
                        ((jobName.name === "Eeproducttest") ? queryKeys.usersListEeProductTest : queryKeys.usersListRegression)
                        : queryKeys.usersList))), query],
        queryFn: () => getUsers(query)
    });

    return (
        <TestCaseQueryResponseContext.Provider value={{ isLoading, refetch, response, query }}>
            {children}
        </TestCaseQueryResponseContext.Provider>
    );
};

const useQueryResponse = () => useContext(TestCaseQueryResponseContext);

const useTestCaseQueryResponseData = () => {
    const { response } = useQueryResponse();

    if (!response)
        return undefined;

    return response?.data || [];
};

const useTestCasePageCountData = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return -1;

    return response.pageCount || -1;
};

const useTestCaseTotalRows = (): number => {
    const { response } = useQueryResponse();

    if (!response)
        return 0;

    return response.totalRows || 0;
};

const useTestCaseQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse();
    return isLoading;
};

export {
    TestCaseQueryResponseProvider,
    TestCaseQueryResponseContext,
    useTestCaseQueryResponseData,
    useTestCasePageCountData,
    useTestCaseTotalRows,
    useTestCaseQueryResponseLoading
};
