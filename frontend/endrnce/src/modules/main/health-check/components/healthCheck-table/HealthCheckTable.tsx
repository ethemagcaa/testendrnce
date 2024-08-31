import React, { FC, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";
import { useIntl } from "react-intl";

import {
    useHealthCheckListQueryResponseLoading, useHealthCheckListPageCountData,
    useHealthCheckListQueryResponseData
} from "@modules/main/health-check/context/healthCheck-list-query-responsive-context";
import { CardBody } from "@components/card/CardBody";
import { Card } from "@components/card/Card";
import { HealthCheckListHeader } from "@modules/main/health-check/components/healthCheck-table/HealthCheckTableHeader";
import { healthCheckColumns } from "@modules/main/health-check/components/healthCheck-table/healthCheck-columns";

const HealthCheckTable: FC = () => {
    const intl = useIntl();
    const healthcheck = useHealthCheckListQueryResponseData();
    const pageCounter = useHealthCheckListPageCountData();
    const isLoading = useHealthCheckListQueryResponseLoading();
    const data = useMemo(() => healthcheck, [healthcheck]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => healthCheckColumns(intl), [intl]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);

    return (
        <Card>
            <HealthCheckListHeader />
            <CardBody>
                <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
            </CardBody>
        </Card>
    );
};

export default HealthCheckTable;
