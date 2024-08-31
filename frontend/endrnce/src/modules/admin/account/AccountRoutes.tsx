import React, { FC } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Settings } from "@modules/admin/account/components/settings/Settings";
import { AccountHeader } from "@modules/admin/account/AccountHeader";
import { adminRoutes, getLastSegments } from "@/constants/routeConstants";

const settingsRoute = getLastSegments(adminRoutes.account.child.settings);

const AccountRoutes: FC = () => (
    <Routes>
        <Route element={
            <>
                <AccountHeader />
                <Outlet/>
            </>
        }>
            <Route
                path={settingsRoute}
                element={
                    <>
                        <Settings/>
                    </>
                }
            />
            <Route index element={<Navigate to={adminRoutes.account.route} />} />
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
    </Routes>
);

export default AccountRoutes;
