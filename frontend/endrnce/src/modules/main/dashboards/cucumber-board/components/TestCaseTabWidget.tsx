import React, { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DataTableProvider } from "@components/data-table/context/data-table-context";
import {
    TestCaseQueryResponseProvider
} from "@modules/main/dashboards/cucumber-board/context/test-case-query-responsive-context";
import { TestCaseTable } from "@modules/main/dashboards/cucumber-board/components/test-case-table/TestCaseTable";
import { TestCaseTableProvider } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { ServerTypeProvider } from "@modules/main/dashboards/cucumber-board/context/server-type-context";
import { Tabs } from "@components/tabs/Tabs";
import { Tab } from "@components/tabs/Tab";
import { TabContent } from "@components/tabs/TabContent";
import { TabPane } from "@components/tabs/TabPane";
import { Card } from "@components/card/Card";
import { Separator } from "@components/separator/Separator";

const TestCaseTabWidget: FC = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get("tab") || "enterprise-test-cases";

    useEffect(() => {
        const tabs = ["enterprise-test-cases", "exclude-enterprise-and-bsg-only-test-cases", "bsg-only-test-cases"];
        if (!tabs.includes(activeTab))
            navigate({ search: "?tab=enterprise-test-cases" }, { replace: true });

    }, [activeTab, navigate]);

    return (
        <Card className="mb-xl-12">
            <Tabs>
                <Tab
                    className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${activeTab === "enterprise-test-cases" ? "active" : ""} fw-bold fs-5 px-4 me-1`}
                    dataBsToggle='tab'
                    href='#enterprise-test-cases'
                    onClick={() => {
                        navigate({ search: "?tab=enterprise-test-cases" });
                    }}
                    label="Enterprise Test Cases"
                />
                <Tab
                    className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${activeTab === "exclude-enterprise-and-bsg-only-test-cases" ? "active" : ""} fw-bold fs-5 px-4 me-1`}
                    dataBsToggle='tab'
                    href='#exclude-enterprise-and-bsg-only-test-cases'
                    onClick={() => {
                        navigate({ search: "?tab=exclude-enterprise-and-bsg-only-test-cases" });
                    }}
                    label="Exclude Enterprise and Bsg Only Test Cases"
                />
                <Tab
                    className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${activeTab === "bsg-only-test-cases" ? "active" : ""} fw-bold fs-5 px-4`}
                    dataBsToggle='tab'
                    href='#bsg-only-test-cases'
                    onClick={() => {
                        navigate({ search: "?tab=bsg-only-test-cases" });
                    }}
                    label="Bsg Only Test Cases"
                />
            </Tabs>

            <Separator style="dashed" utilityMY={1} />

            <TabContent>
                <TabPane
                    className={`tab-pane fade ${activeTab === "enterprise-test-cases" ? "show active" : ""}`}
                    id='enterprise-test-cases'
                >
                    <ServerTypeProvider isEnterprise >
                        <DataTableProvider>
                            <TestCaseQueryResponseProvider>
                                <TestCaseTableProvider>
                                    <TestCaseTable />
                                </TestCaseTableProvider>
                            </TestCaseQueryResponseProvider>
                        </DataTableProvider>
                    </ServerTypeProvider>
                </TabPane>
                <TabPane
                    className={`tab-pane fade ${activeTab === "exclude-enterprise-and-bsg-only-test-cases" ? "show active" : ""}`}
                    id='exclude-enterprise-and-bsg-only-test-cases'
                >
                    <ServerTypeProvider isExcludeEnterpriseBsg >
                        <DataTableProvider>
                            <TestCaseQueryResponseProvider>
                                <TestCaseTableProvider>
                                    <TestCaseTable />
                                </TestCaseTableProvider>
                            </TestCaseQueryResponseProvider>
                        </DataTableProvider>
                    </ServerTypeProvider>
                </TabPane>
                <TabPane
                    className={`tab-pane fade ${activeTab === "bsg-only-test-cases" ? "show active" : ""}`}
                    id='bsg-only-test-cases'
                >
                    <ServerTypeProvider isBsgOnly >
                        <DataTableProvider>
                            <TestCaseQueryResponseProvider>
                                <TestCaseTableProvider>
                                    <TestCaseTable />
                                </TestCaseTableProvider>
                            </TestCaseQueryResponseProvider>
                        </DataTableProvider>
                    </ServerTypeProvider>
                </TabPane>
            </TabContent>
        </Card>
    );
};

export default TestCaseTabWidget;
