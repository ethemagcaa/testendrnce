import React, { FC, useContext, useMemo } from "react";
import { DataTable } from "@components/data-table/DataTable";

import { testCasesColumns } from "@modules/main/dashboards/cucumber-board/components/test-case-table/columns/test-case-columns";
import { CardBody } from "@components/card/CardBody";
import { useIntl } from "react-intl";
import { DataTablePagination } from "@components/data-table/components/pagination/DataTablePagination";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { TestCaseTableHeader } from "@modules/main/dashboards/cucumber-board/components/test-case-table/TestCaseTableHeader";
import {
    useTestCaseQueryResponseLoading,
    useTestCasePageCountData,
    useTestCaseQueryResponseData, useTestCaseTotalRows
} from "@modules/main/dashboards/cucumber-board/context/test-case-query-responsive-context";
import { TestCaseTableContext } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { TestStepModal } from "@modules/main/dashboards/cucumber-board/components/test-step-modal/TestStepModal";
import { PopularTagsWidget } from "@modules/main/dashboards/cucumber-board/components/PopularTagsWidget";
import { JobNameContext } from "@modules/main/dashboards/cucumber-board/context/job-name-context";

const TestCaseTable: FC = () => {
    const { table } = useContext(DataTableContext);
    const { dataForShowingTestStep } = useContext(TestCaseTableContext);
    const intl = useIntl();
    const testcases = useTestCaseQueryResponseData();
    const pageCounter = useTestCasePageCountData();
    const totalRows = useTestCaseTotalRows();
    const isLoading = useTestCaseQueryResponseLoading();
    const data = useMemo(() => testcases, [testcases]);
    const columns = useMemo(() => testCasesColumns(intl), [intl]);
    const pageCount = useMemo(() => pageCounter, [pageCounter]);
    const { isTestCasesofJobNamesPage, jobName } = useContext(JobNameContext);

    return (
        <>
            {(jobName || !isTestCasesofJobNamesPage) && (
                <>
                    {!isTestCasesofJobNamesPage && <PopularTagsWidget />}
                    <TestCaseTableHeader />
                    <CardBody>
                        <DataTable data={data} columns={columns} pageCount={pageCount} isLoading={isLoading} />
                        <DataTablePagination table={table} totalRows={totalRows} isLoading={isLoading} />
                    </CardBody>
                    {dataForShowingTestStep && <TestStepModal data={dataForShowingTestStep} />}
                </>
            )}
        </>
    );

};

export { TestCaseTable };
