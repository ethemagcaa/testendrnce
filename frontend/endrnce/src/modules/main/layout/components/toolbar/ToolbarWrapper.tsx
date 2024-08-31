import React, { useContext } from "react";
import clsx from "clsx";

import { LayoutContext } from "@modules/admin/layout/context/layout-context";
import ToolbarPageTitleWrapper from "@modules/admin/layout/components/toolbar/page-title/ToolbarPageTitleWrapper";
import { ToolbarType } from "@modules/admin/layout/model/LayoutModels";

const ToolbarWrapper: React.FC = () => {
    const { config, classes } = useContext(LayoutContext);

    if (!config.app?.toolbar?.display)
        return null;

    const isPageTitleVisible = showPageTitle(
        config.app?.toolbar?.layout,
        config.app?.pageTitle?.display
    );

    return (
        <div
            id='kt_app_toolbar'
            className={clsx("app-toolbar", classes.toolbar.join(" "), config?.app?.toolbar?.class)}
        >
            <div
                id='kt_app_toolbar_container'
                className={clsx(
                    "app-container",
                    "container-xxl"
                )}
            >
                {isPageTitleVisible && <ToolbarPageTitleWrapper />}
            </div>
        </div>
    );
};

const showPageTitle = (appToolbarLayout?: ToolbarType, appPageTitleDisplay?: boolean): boolean => {
    const viewsWithPageTitles = ["classic", "reports", "saas"];
    if (!appToolbarLayout || !appPageTitleDisplay)
        return false;


    return appPageTitleDisplay && viewsWithPageTitles.some((t) => t === appToolbarLayout);
};

export default ToolbarWrapper;
