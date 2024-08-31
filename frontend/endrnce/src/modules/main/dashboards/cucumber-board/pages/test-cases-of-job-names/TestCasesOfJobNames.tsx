import React, { FC } from "react";
import { TagsProvider } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    TestCaseQueryResponseProvider
} from "@modules/main/dashboards/cucumber-board/context/test-case-query-responsive-context";
import { TestCaseTable } from "@modules/main/dashboards/cucumber-board/components/test-case-table/TestCaseTable";
import { TestCaseTableProvider } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { Card } from "@components/card/Card";
import { TestCasesOfJobNamesFilter } from "./TestCasesOfJobNamesFilter";
import { JobNameProvider } from "@modules/main/dashboards/cucumber-board/context/job-name-context";

const TestCasesOfJobNames: FC = () => {

    return (
        <JobNameProvider>
            <TestCasesOfJobNamesFilter />
            <Card className="mb-xl-12">
                <TagsProvider>
                    <DataTableProvider>
                        <TestCaseQueryResponseProvider>
                            <TestCaseTableProvider>
                                <TestCaseTable />
                            </TestCaseTableProvider>
                        </TestCaseQueryResponseProvider>
                    </DataTableProvider>
                </TagsProvider>
            </Card>
        </JobNameProvider>
    );
};

export { TestCasesOfJobNames };
