import React, { FC } from "react";
import { mainRoutes } from "@/constants/routeConstants";
import { Route, Routes, Navigate } from "react-router-dom";
import { EnterpriseBoard } from "@modules/main/dashboards/cucumber-board/EnterpriseBoard";
import { Overview } from "@modules/main/dashboards/cucumber-board/pages/overview/Overview";
import { TestCasesOfJobNames } from "@modules/main/dashboards/cucumber-board/pages/test-cases-of-job-names/TestCasesOfJobNames";

const EnterpriseRoutes: FC = () => {
    return (
        <Routes>
            <Route element={<EnterpriseBoard />}>
                <Route path='overview' element={<Overview />}/>
                <Route path='test-cases-of-job-names' element={<TestCasesOfJobNames />}/>
                <Route index element={<Navigate to={`${mainRoutes.enterprise}/overview`} />} />
                {/* Page Not Found */}
                <Route path='*' element={<Navigate to='/error/404' />} />
            </Route>
        </Routes>
    );
};

export { EnterpriseRoutes };
