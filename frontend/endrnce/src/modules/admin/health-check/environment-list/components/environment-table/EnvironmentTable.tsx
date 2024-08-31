import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import {
    environmentColumns
} from "@modules/admin/health-check/environment-list/components/environment-table/environment-columns";
import {
    EnvironmentTableHeader
} from "@modules/admin/health-check/environment-list/components/environment-table/EnvironmentTableHeader";
import {
    useEnvironmentListPageCountData,
    useEnvironmentListQueryResponseData, useEnvironmentListQueryResponseLoading, useEnvironmentListTotalRows
} from "@modules/admin/health-check/environment-list/context/environment-list-query-response-context";


const EnvironmentTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const intl = useIntl();
    const navigate = useNavigate();
    const vendors = useEnvironmentListQueryResponseData();
    const pageCounter = useEnvironmentListPageCountData();
    const totalRows = useEnvironmentListTotalRows();
    const isLoading = useEnvironmentListQueryResponseLoading();
    const data = useMemo(() => vendors, [vendors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => environmentColumns(intl, navigate), [intl]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <EnvironmentTableHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export { EnvironmentTable };
