import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";
import { useIntl } from "react-intl";

import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { EndpointTableHeader } from "@modules/admin/health-check/endpoint-list/components/endpoint-table/EndpointTableHeader";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { endpointColumns } from "@modules/admin/health-check/endpoint-list/components/endpoint-table/endpoint-columns";
import {
    useEndpointListPageCountData,
    useEndpointListQueryResponseData,
    useEndpointListTotalRows, useEndpointListQueryResponseLoading
} from "@modules/admin/health-check/endpoint-list/context/endpoint-list-query-response-context";
import { useNavigate } from "react-router-dom";

const EndpointTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const intl = useIntl();
    const navigate = useNavigate();
    const endpoints = useEndpointListQueryResponseData();
    const pageCounter = useEndpointListPageCountData();
    const totalRows = useEndpointListTotalRows();
    const isLoading = useEndpointListQueryResponseLoading();
    const data = useMemo(() => endpoints, [endpoints]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => endpointColumns(intl, navigate), [intl]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <EndpointTableHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export { EndpointTable };
