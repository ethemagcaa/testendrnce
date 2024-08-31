import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { RolesTable } from "@modules/admin/user-management/role/role-list/components/users-table/RolesTable";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import { adminRoutes } from "@/constants/routeConstants";
import { RoleListQueryResponseProvider } from "./context/role-list-query-response-context";

const RolesList: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "User Management" }),
            path: adminRoutes.users.route,
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
                {intl.formatMessage({ id: "Roles List" })}
            </PageTitle>
            <DataTableProvider>
                <RoleListQueryResponseProvider>
                    <RolesTable/>
                </RoleListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { RolesList };
