import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { UsersTable } from "@modules/admin/user-management/users-list/components/users-table/UsersTable";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    UserListQueryResponseProvider
} from "@modules/admin/user-management/users-list/context/user-list-query-response-context";
import { adminRoutes } from "@/constants/routeConstants";

const UsersList: FC = () => {
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
                {intl.formatMessage({ id: "Users List" })}
            </PageTitle>
            <DataTableProvider>
                <UserListQueryResponseProvider>
                    <UsersTable/>
                </UserListQueryResponseProvider>
            </DataTableProvider>
        </>
    );
};

export { UsersList };
