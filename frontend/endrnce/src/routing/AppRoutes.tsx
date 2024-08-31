import React, { FC, useContext } from "react";
import { shallowEqual } from "react-redux";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import App from "@/App";
import { useAppSelector } from "@hooks/use-redux";
import Logout from "@modules/admin/auth/components/Logout";
import { PrivateRoutes } from "@routing/PrivateRoutes";
import ErrorsRoutes from "@modules/errors/ErrorsRoutes";
import AuthRoutes from "@modules/admin/auth/AuthRoutes";
import { AuthContext } from "@modules/admin/auth/context/auth-context";
import { LayoutSplashScreen } from "@components/splash-screen/SplashScreen";
import { adminRoutes } from "@/constants/routeConstants";
import { MainRoutes } from "@routing/MainRoutes";

const AppRoutes: FC = () => {
    const isAuthorized = useAppSelector((state) => state.auth.isAuthenticated, shallowEqual);
    const authContext = useContext(AuthContext);

    if(!isAuthorized && authContext.tokenData)
        return <LayoutSplashScreen></LayoutSplashScreen>;

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<App/>}>
                    <Route path="error/*" element={<ErrorsRoutes />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="admin/*" element={<Outlet />}>
                        {isAuthorized ? (
                            <>
                                <Route path="*" element={<PrivateRoutes />} />
                                <Route index element={<Navigate to={adminRoutes.dashboard} />}/>
                            </>
                        ) : (
                            <>
                                <Route path="auth/*" element={<AuthRoutes/>}/>
                                <Route path="*" element={<Navigate to={adminRoutes.auth} />}/>
                            </>
                        )}
                    </Route>
                    <Route path="*" element={<Outlet />}>
                        <Route path="*" element={<MainRoutes />} />
                        <Route index element={<Navigate to="/dashboards" />}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export { AppRoutes };
