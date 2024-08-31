import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import {
    useVendorListQueryResponseLoading, useVendorListPageCountData,
    useVendorListQueryResponseData, useVendorListTotalRows
} from "@modules/admin/health-check/vendor-list/context/vendor-list-query-response-context";
import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { VendorTableHeader } from "@modules/admin/health-check/vendor-list/components/vendor-table/VendorTableHeader";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { vendorColumns } from "@modules/admin/health-check/vendor-list/components/vendor-table/vendor-columns";


const VendorTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const intl = useIntl();
    const navigate = useNavigate();
    const vendors = useVendorListQueryResponseData();
    const pageCounter = useVendorListPageCountData();
    const totalRows = useVendorListTotalRows();
    const isLoading = useVendorListQueryResponseLoading();
    const data = useMemo(() => vendors, [vendors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => vendorColumns(intl, navigate), [intl]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <VendorTableHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export { VendorTable };
