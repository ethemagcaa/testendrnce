import React, { FC, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";

import { LayoutContext } from "@modules/admin/layout/context/layout-context";
import { DrawerComponent } from "@assets/ts/components";
import { WithChildren } from "@library/Types";

const Content: FC<WithChildren> = ({ children }) => {
    const { config, classes } = useContext(LayoutContext);
    const location = useLocation();

    useEffect(() => {
        DrawerComponent.hideAll();
    }, [location]);

    const appContentContainer = config.app?.content?.container;
    return (
        <div id='kt_app_content' className={clsx("app-content flex-column-fluid", classes.content.join(" "), config?.app?.content?.class)}>
            {appContentContainer ? (
                <div
                    id='kt_app_content_container'
                    className={clsx(
                        "app-container",
                        "container-xxl"
                    )}
                >
                    {children}
                </div>
            ) : (
                <>{children}</>
            )}
        </div>
    );
};

export default Content;
