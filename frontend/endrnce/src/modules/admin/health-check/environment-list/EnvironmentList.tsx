import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import { adminRoutes } from "@/constants/routeConstants";
import {
    EnvironmentListQueryResponseProvider
} from "@modules/admin/health-check/environment-list/context/environment-list-query-response-context";
import {
    EnvironmentTable
} from "@modules/admin/health-check/environment-list/components/environment-table/EnvironmentTable";

const EnvironmentList: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Health Check" }),
            path: adminRoutes.healthCheck.route,
            isSeparator: false,
            isActive: false,
        },
        {
            title: "",
            path: "",
            isSeparator: true,
            isActive: false,
        },
    ];

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: "Environment Management" })}
            </PageTitle>
            <DataTableProvider>
                <EnvironmentListQueryResponseProvider>
                    <EnvironmentTable />
                </EnvironmentListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { EnvironmentList };
