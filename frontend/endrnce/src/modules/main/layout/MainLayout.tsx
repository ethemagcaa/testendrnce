import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router";

import { PageDataProvider } from "@modules/admin/layout/context/page-context";
import { ThemeModeProvider } from "@modules/admin/layout/context/theme-mode-context";
import HeaderWrapper from "@modules/main/layout/components/header/HeaderWrapper";
import { MenuComponent } from "@assets/ts/components";
import ToolbarWrapper from "@modules/main/layout/components/toolbar/ToolbarWrapper";
import Content from "@modules/main/layout/components/content/Content";

const MainLayout: React.FC = () => {
    const location = useLocation();

    const bodyAttributes = document.body.getAttributeNames().filter((t) => t.indexOf("data-") > -1);
    bodyAttributes.forEach((attr) => document.body.removeAttribute(attr));
    document.body.setAttribute("data-kt-app-layout", "dark-header");
    document.body.setAttribute("data-kt-app-header-fixed", "true");
    document.body.setAttribute("data-kt-app-header-fixed-mobile", "true");

    useEffect(() => {
        setTimeout(() => {
            MenuComponent.reinitialization();
        }, 500);
    }, [location.key]);

    return (
        <PageDataProvider>
            <ThemeModeProvider>
                <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
                    <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                        <HeaderWrapper />
                        <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
                            <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
                                <div className='d-flex flex-column flex-column-fluid'>
                                    <ToolbarWrapper />
                                    <Content>
                                        <Outlet />
                                    </Content>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeModeProvider>
        </PageDataProvider>
    );
};

export default MainLayout;
