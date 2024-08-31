import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@pages/main/IndexPage";
import MainLayout from "@modules/main/layout/MainLayout";
import { SuspenseView } from "@components/suspense-view/SuspenseView";
import { DashboardsRoutes } from "@modules/main/dashboards/DashboardsRoutes";
import { HealthCheck } from "@modules/main/health-check/HealthCheck";
import { FeatureMap } from "@modules/main/feature-map/FeatureMap";

const MainRoutes: FC = () => {

    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="index" element={<IndexPage/>}/>
                <Route
                    path='dashboards/*'
                    element={
                        <SuspenseView>
                            <DashboardsRoutes />
                        </SuspenseView>
                    }
                />
                <Route path="health-check" element={<HealthCheck />} />
                <Route path="feature-map" element={<FeatureMap />} />
                {/* Page Not Found */}
                <Route path='*' element={<Navigate to='/error/404' state={"main"}/>}/>
            </Route>
        </Routes>
    );
};

export { MainRoutes };
