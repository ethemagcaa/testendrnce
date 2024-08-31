import React, { FC } from "react";
import { useIntl } from "react-intl";

import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { mainRoutes } from "@/constants/routeConstants";
import TestResultsFilter from "@modules/main/dashboards/test-results/components/filter/TestResultsFilter";
import TestResultsHistoryChart from "@modules/main/dashboards/test-results/components/TestResultsHistoryChart";
import { TestResultProvider } from "@modules/main/dashboards/test-results/context/test-result-context";
import TestResultsSummary from "@modules/main/dashboards/test-results/components/TestResultsSummary";
import TestResultsEnvironment from "@modules/main/dashboards/test-results/components/TestResultsEnvironment";

const TestResultsBoard: FC = () => {
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
                {intl.formatMessage({ id: "Test Results Board" })}
            </PageTitle>
            <TestResultProvider>
                <>
                    <TestResultsFilter />
                    <div className="row">
                        <div className="col-xxl-12 mb-12 mb-xl-12">
                            <TestResultsHistoryChart />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-6 mb-xl-6">
                            <TestResultsSummary />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-6 mb-xl-6">
                            <TestResultsEnvironment />
                        </div>
                    </div>
                </>
            </TestResultProvider>
        </>
    );
};

export default TestResultsBoard;
