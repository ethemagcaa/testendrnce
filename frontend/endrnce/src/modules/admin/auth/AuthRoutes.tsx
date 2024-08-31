import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "@modules/admin/auth/components/Login";
import Registration from "@modules/admin/auth/components/Registration";
import ForgotPassword from "@modules/admin/auth/components/ForgotPassword";
import OAuth2RedirectHandler from "@modules/admin/auth/components/OAuth2RedirectHandler";
import AuthLayout from "@modules/admin/auth/AuthLayout";

const AuthRoutes: FC = () => (
    <Routes>
        <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />}>
                <Route path="oauth2/redirect" element={<OAuth2RedirectHandler />} />
            </Route>
            <Route path="registration" element={<Registration />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route index element={<Login />} />
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
    </Routes>
);

export default AuthRoutes;
