import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { VendorTable } from "@modules/admin/health-check/vendor-list/components/vendor-table/VendorTable";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    VendorListQueryResponseProvider
} from "@modules/admin/health-check/vendor-list/context/vendor-list-query-response-context";
import { adminRoutes } from "@/constants/routeConstants";

const VendorList: FC = () => {
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
                {intl.formatMessage({ id: "Vendor Management" })}
            </PageTitle>
            <DataTableProvider>
                <VendorListQueryResponseProvider>
                    <VendorTable/>
                </VendorListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { VendorList };
