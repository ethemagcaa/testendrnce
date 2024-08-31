import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import { mainRoutes } from "@/constants/routeConstants";
import HealthCheckTable from "./components/healthCheck-table/HealthCheckTable";
import  { HealthCheckListQueryResponseProvider } from "./context/healthCheck-list-query-responsive-context";

const HealthCheck: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Dashboards" }),
            path: mainRoutes.dashboards,
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
                {intl.formatMessage({ id: "Health Check" })}
            </PageTitle>
            <DataTableProvider>
                <HealthCheckListQueryResponseProvider>
                    <HealthCheckTable/>
                </HealthCheckListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { HealthCheck };
