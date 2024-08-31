import React, { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import useAsset from "@hooks/use-asset";
import useThemeModeSwitcher from "@hooks/use-theme-mode-swither";

const AuthLayout: FC = () => {
    const toAbsoluteUrl = useAsset();
    const themeSwitcher = useThemeModeSwitcher();

    useEffect(() => {
        const root = document.getElementById("root");
        if (root)
            root.style.height = "100%";

        return () => {
            if (root)
                root.style.height = "auto";

        };
    }, []);

    return (
        <div
            className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
            style={{
                backgroundImage: `url(${themeSwitcher(toAbsoluteUrl("/media/illustrations/auth-bg.png"))})`,
            }}
        >
            {/* begin::Content */}
            <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                {/* begin::Logo */}
                <a href="@modules/admin/auth/AuthLayout#top" className="mb-12">
                    <img alt="Logo" src={toAbsoluteUrl("/media/logos/logo-1.svg")} className="theme-light-show h-30px" />
                    <img alt="Logo" src={toAbsoluteUrl("/media/logos/logo-1-dark.svg")} className="theme-dark-show h-30px" />
                </a>
                {/* end::Logo */}
                {/* begin::Wrapper */}
                <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                    <Outlet />
                </div>
                {/* end::Wrapper */}
            </div>
            {/* end::Content */}
            {/* begin::Footer */}
            <div className="d-flex flex-center flex-column-auto p-10">
                <div className="d-flex align-items-center fw-bold fs-6">
                    <div className="text-muted px-2">
                        <FormattedMessage id="Version : " />
                        {" "}
                        <b>{process.env.npm_package_version}</b>
                    </div>
                </div>
            </div>
            {/* end::Footer */}
        </div>
    );
};

export default AuthLayout;
