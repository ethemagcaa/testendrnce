import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";

import { usersColumns } from "@modules/admin/user-management/users-list/components/users-table/user-columns";
import {
    useUserQueryResponseLoading, useUserListPageCountData,
    useUserListQueryResponseData, useUserListTotalRows
} from "@modules/admin/user-management/users-list/context/user-list-query-response-context";
import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { useIntl } from "react-intl";
import { useLang } from "@i18n/i18n-endurance-context";
import { UsersTableHeader } from "@modules/admin/user-management/users-list/components/users-table/UsersTableHeader";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { useNavigate } from "react-router-dom";


const UsersTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const intl = useIntl();
    const locale = useLang();
    const navigate = useNavigate();
    const users = useUserListQueryResponseData();
    const pageCounter = useUserListPageCountData();
    const totalRows = useUserListTotalRows();
    const isLoading = useUserQueryResponseLoading();
    const data = useMemo(() => users, [users]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => usersColumns(intl, locale,navigate), [intl, locale]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <UsersTableHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export { UsersTable };
