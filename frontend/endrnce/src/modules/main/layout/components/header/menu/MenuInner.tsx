import React from "react";
import { useIntl } from "react-intl";

import { MenuItem } from "@modules/admin/layout/components/header/menu/MenuItem";
import { MenuInnerWithSub } from "@modules/main/layout/components/header/menu/MenuInnerWithSub";
import { mainRoutes } from "@/constants/routeConstants";

export function MenuInner() {
    const intl = useIntl();

    return (
        <>
            <MenuInnerWithSub
                title={intl.formatMessage({ id: "Dashboards" })}
                to={mainRoutes.dashboards}
                menuPlacement='bottom-start'
                menuTrigger='click'
                icon='abstract-28'
            >
                <MenuItem
                    to={mainRoutes.cucumber}
                    title='Web UI Dashboard'
                    icon='bi bi-browser-chrome'
                />
                <MenuItem
                    to={mainRoutes.testResults}
                    title='Test Results Dashboard'
                    icon='bi bi-bar-chart-line-fill'
                />
                <MenuItem
                    to={mainRoutes.enterprise}
                    title='Enterprise Dashboard'
                    icon='brifecase-timer'
                />
            </MenuInnerWithSub>

            <MenuItem
                title={intl.formatMessage({ id: "Health Check" })}
                to={mainRoutes.healthCheck}
                icon='abstract-27'
            ></MenuItem>

            <MenuItem
                title={intl.formatMessage({ id: "Feature Map" })}
                to={mainRoutes.featureMap}
                icon='map'
            ></MenuItem>
        </>
    );
}
