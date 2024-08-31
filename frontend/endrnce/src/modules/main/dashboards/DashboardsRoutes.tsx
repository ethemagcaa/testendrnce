import React, { FC } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { mainRoutes } from "@/constants/routeConstants";
import { CucumberBoard } from "@modules/main/dashboards/cucumber-board/CucumberBoard";
import TestResultsBoard from "@modules/main/dashboards/test-results/TestResultsBoard";
import { EnterpriseRoutes } from "@modules/main/dashboards/cucumber-board/routing/EnterpriseRoutes";
import HealthCheckBoard from "./healthCheck-board/HealthCheckBoard";

const DashboardsRoutes: FC = () => (
    <Routes>
        <Route element={<Outlet />}>
            <Route path="cucumber" element={<CucumberBoard />} />
            <Route path="test-results" element={<TestResultsBoard />} />
            <Route path="enterprise/*" element={<EnterpriseRoutes />} />
            <Route path="healthcheck" element={<HealthCheckBoard />} />
            <Route index element={<Navigate to={mainRoutes.cucumber} />} />
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404'/>}/>
        </Route>
    </Routes>
);

export { DashboardsRoutes };
