import React, { FC, useContext } from "react";

import { LayoutContext } from "@modules/admin/layout/context/layout-context";
import useAsset from "@hooks/use-asset";
import Header from "@modules/main/layout/components/header/Header";

const HeaderWrapper: FC = () => {
    const { config } = useContext(LayoutContext);
    const toAbsoluteUrl = useAsset();

    if (!config.app?.header?.display)
        return null;


    return (
        <div id="kt_app_header" className="app-header" data-kt-sticky="true"
            data-kt-sticky-activate="{default: true, lg: true}"
            data-kt-sticky-name="app-header-minimize"
            data-kt-sticky-offset="{default: '200px', lg: '0'}" data-kt-sticky-animation="false">
            <div
                className="app-container container-xxl d-flex align-items-stretch justify-content-between"
                id="kt_app_header_container">
                <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15">
                    <a href="/">
                        <img alt="Logo" src={toAbsoluteUrl("/media/logos/default-dark.svg")}
                            className="h-60px h-lg-70px app-sidebar-logo-default"/>
                    </a>
                </div>

                <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
                    id="kt_app_header_wrapper">
                    <div className="app-header-menu app-header-mobile-drawer align-items-stretch"
                        data-kt-drawer="true"
                        data-kt-drawer-name="app-header-menu"
                        data-kt-drawer-activate="{default: true, lg: false}"
                        data-kt-drawer-overlay="true"
                        data-kt-drawer-width="250px"
                        data-kt-drawer-direction="end"
                        data-kt-drawer-toggle="#kt_app_header_menu_toggle"
                        data-kt-swapper="true"
                        data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                        data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
                        <Header />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderWrapper;
