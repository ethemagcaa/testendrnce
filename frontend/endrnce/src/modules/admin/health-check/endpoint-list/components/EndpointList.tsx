import React, { FC, useContext } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { EndpointTable } from "@modules/admin/health-check/endpoint-list/components/endpoint-table/EndpointTable";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    EndpointListQueryResponseProvider
} from "@modules/admin/health-check/endpoint-list/context/endpoint-list-query-response-context";
import { adminRoutes } from "@/constants/routeConstants";
import {
    EndpointListContext
} from "@modules/admin/health-check/endpoint-list/context/endpoint-list-context";

const EndpointList: FC = () => {
    const { vendorData } = useContext(EndpointListContext);
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
        {
            title: intl.formatMessage({ id: "Vendor Management" }),
            path: adminRoutes.healthCheck.child.vendor.route,
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
                {intl.formatMessage({ id: "Endpoint List" })}{vendorData ? ` ${vendorData.name}` : ""}
            </PageTitle>
            <DataTableProvider>
                <EndpointListQueryResponseProvider>
                    <EndpointTable />
                </EndpointListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { EndpointList };
