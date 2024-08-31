import React, { FC } from "react";
import { TagsProvider } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { CucumberStatistics } from "@modules/main/dashboards/cucumber-board/components/CucumberStatistics";
import TestCaseTabWidget from "@modules/main/dashboards/cucumber-board/components/TestCaseTabWidget";

const Overview: FC = () => {

    return (
        <TagsProvider>
            <CucumberStatistics isEnterprise />
            <TestCaseTabWidget />
        </TagsProvider>
    );
};

export { Overview };
