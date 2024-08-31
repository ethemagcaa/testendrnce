import React, { FC, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { MasterLayout } from "@modules/admin/layout/MasterLayout";
import DashboardWrapper from "@pages/dashboard/DashboardWrapper";
import AuthInit from "@modules/admin/auth/AuthInit";
import { SuspenseView } from "@components/suspense-view/SuspenseView";
import { adminRoutes, getLastSegments } from "@/constants/routeConstants";
import { FeatureMap } from "@modules/admin/feature-map/FeatureMap";

const PrivateRoutes: FC = () => {
    const AccountRoutes = lazy(() => import("@modules/admin/account/AccountRoutes"));
    const UserRoutes = lazy(() => import("@modules/admin/user-management/UserRoutes"));
    const HealthCheckRoutes = lazy(() => import("@modules/admin/health-check/HealthCheckRoutes"));

    return (
        <AuthInit>
            <Routes>
                <Route element={<MasterLayout/>}>
                    {/* Redirect to Dashboard after success login/registartion */}
                    <Route path={`${getLastSegments(adminRoutes.auth)}/*`} element={<Navigate to={adminRoutes.dashboard}/>}/>
                    <Route path={`${getLastSegments(adminRoutes.dashboard)}/*`} element={<DashboardWrapper/>}/>
                    <Route
                        path={`${getLastSegments(adminRoutes.account.route)}/*`}
                        element={
                            <SuspenseView>
                                <AccountRoutes />
                            </SuspenseView>
                        }
                    />
                    <Route
                        path={`${getLastSegments(adminRoutes.users.route)}/*`}
                        element={
                            <SuspenseView>
                                <UserRoutes />
                            </SuspenseView>
                        }
                    />
                    <Route
                        path={`${getLastSegments(adminRoutes.healthCheck.route)}/*`}
                        element={
                            <SuspenseView>
                                <HealthCheckRoutes />
                            </SuspenseView>
                        }
                    />
                    <Route
                        path={`${getLastSegments(adminRoutes.featureMap)}/*`}
                        element={
                            <SuspenseView>
                                <FeatureMap />
                            </SuspenseView>
                        }
                    />
                    {/* Page Not Found */}
                    <Route path='*' element={<Navigate to='/error/404'/>}/>
                </Route>
            </Routes>
        </AuthInit>
    );
};

export { PrivateRoutes };
