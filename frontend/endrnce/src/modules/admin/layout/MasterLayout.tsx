import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router";

import { PageDataProvider } from "@modules/admin/layout/context/page-context";
import { ThemeModeProvider } from "@modules/admin/layout/context/theme-mode-context";
import HeaderWrapper from "@modules/admin/layout/components/header/HeaderWrapper";
import { Sidebar } from "@modules/admin/layout/components/sidebar/Sidebar";
import { MenuComponent } from "@assets/ts/components";
import Content from "@modules/admin/layout/components/content/Content";
import ToolbarWrapper from "@modules/admin/layout/components/toolbar/ToolbarWrapper";

const MasterLayout: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            MenuComponent.reinitialization();
        }, 500);
    }, [location.key]);

    return (
        <PageDataProvider>
            <ThemeModeProvider>
                <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
                    <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
                        <HeaderWrapper />
                        <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
                            <Sidebar />
                            <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
                                <div className='d-flex flex-column flex-column-fluid'>
                                    <ToolbarWrapper />
                                    <Content>
                                        <Outlet />
                                    </Content>
                                </div>
                                {/*<FooterWrapper />*/}
                            </div>
                        </div>
                    </div>
                </div>

                {/*/!* begin:: Drawers *!/*/}
                {/*<ActivityDrawer />*/}
                {/*<RightToolbar />*/}
                {/*<DrawerMessenger />*/}
                {/*/!* end:: Drawers *!/*/}

                {/*/!* begin:: Modals *!/*/}
                {/*<InviteUsers />*/}
                {/*<UpgradePlan />*/}
                {/*/!* end:: Modals *!/*/}
                {/*<ScrollTop />*/}
            </ThemeModeProvider>
        </PageDataProvider>
    );
};

export { MasterLayout };
