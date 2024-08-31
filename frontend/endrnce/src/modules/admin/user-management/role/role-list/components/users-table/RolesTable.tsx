import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";
import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { useIntl } from "react-intl";
import { useLang } from "@i18n/i18n-endurance-context";
import { RolesTableHeader } from "@modules/admin/user-management/role/role-list/components/users-table/RolesTableHeader";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { useNavigate } from "react-router-dom";
import { rolesColumns } from "@modules/admin/user-management/role/role-list/components/users-table/role-columns";
import { useRoleListPageCountData, useRoleListQueryResponseData, useRoleListTotalRows, useRoleQueryResponseLoading } from "@modules/admin/user-management/role/role-list/context/role-list-query-response-context";


const RolesTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const intl = useIntl();
    const locale = useLang();
    const navigate = useNavigate();
    const users = useRoleListQueryResponseData();
    const pageCounter = useRoleListPageCountData();
    const totalRows = useRoleListTotalRows();
    const isLoading = useRoleQueryResponseLoading();
    const data = useMemo(() => users, [users]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => rolesColumns(intl, locale,navigate), [intl, locale]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <RolesTableHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export { RolesTable };
