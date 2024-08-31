import React, { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    TestCaseQueryResponseProvider
} from "@modules/main/dashboards/cucumber-board/context/test-case-query-responsive-context";
import { TestCaseTable } from "@modules/main/dashboards/cucumber-board/components/test-case-table/TestCaseTable";
import { mainRoutes } from "@/constants/routeConstants";
import { TestCaseTableProvider } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { TagsProvider } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { Card } from "@components/card/Card";


const HealthCheckBoard: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Dashboards" }),
            path: mainRoutes.dashboards,
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
                {intl.formatMessage({ id: "Health-Check Board" })}
            </PageTitle>
            <TagsProvider>
                <DataTableProvider>
                    <TestCaseQueryResponseProvider>
                        <TestCaseTableProvider>
                            <Card className="mb-xl-12">
                                <TestCaseTable/>
                            </Card>
                        </TestCaseTableProvider>
                    </TestCaseQueryResponseProvider>
                </DataTableProvider>
            </TagsProvider>
        </>
    );
};

export default HealthCheckBoard;
