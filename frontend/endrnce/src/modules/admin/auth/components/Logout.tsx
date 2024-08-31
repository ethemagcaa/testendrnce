import React, { FC, useContext, useEffect } from "react";
import { Navigate, Routes } from "react-router-dom";

import { AuthContext } from "@modules/admin/auth/context/auth-context";
import { adminRoutes } from "@/constants/routeConstants";

const Logout: FC = () => {
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.logout(true);
        document.location.reload();
    }, [authContext]);

    return (
        <Routes>
            <Navigate to={adminRoutes.login} />
        </Routes>
    );
};

export default Logout;
