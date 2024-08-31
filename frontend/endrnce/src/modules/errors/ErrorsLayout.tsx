import React, { FC, memo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import useAsset from "@hooks/use-asset";
import useThemeModeSwitcher from "@hooks/use-theme-mode-swither";
import { adminRoutes, mainRoutes } from "@/constants/routeConstants";

const ErrorsLayout: FC = () => {
    const toAbsoluteUrl = useAsset();
    const themeSwitcher = useThemeModeSwitcher();
    const location = useLocation();

    let mainPage = adminRoutes.root;
    if(location.state === "main")
        mainPage = mainRoutes.root;

    return (
        <div className="d-flex flex-column flex-root">
            <div
                className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
            >
                <div className="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">
                    <a href={adminRoutes.dashboard} className="mb-10 pt-lg-20">
                        <img alt="Logo" src={toAbsoluteUrl("/media/logos/logo-1.svg")} className="theme-light-show h-45px" />
                        <img alt="Logo" src={toAbsoluteUrl("/media/logos/logo-1-dark.svg")} className="theme-dark-show h-45px" />
                    </a>
                    <div className="pt-lg-10 mb-10">
                        <Outlet />
                        <div className="text-center">
                            <Link to={mainPage} className="btn btn-lg btn-primary fw-bolder">
                                <FormattedMessage id="Go to homepage" />
                            </Link>
                        </div>
                    </div>
                    <div
                        className="
                            d-flex
                            flex-row-auto
                            bgi-no-repeat
                            bgi-position-x-center
                            bgi-size-contain
                            bgi-position-y-bottom
                            min-h-100px min-h-lg-350px
                        "
                        style={{
                            backgroundImage: `url('${themeSwitcher(toAbsoluteUrl("/media/illustrations/error-page-bg.png"))}')`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(ErrorsLayout);
