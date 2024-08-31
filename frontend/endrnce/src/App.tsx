import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { LayoutSplashScreen } from "@components/splash-screen/SplashScreen";
import { LayoutProvider } from "@modules/admin/layout/context/layout-context";
import MasterInit from "@modules/admin/layout/MasterInit";

function App() {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <LayoutProvider>
                <Outlet/>
                <MasterInit/>
            </LayoutProvider>
        </Suspense>
    );
}

export default App;
