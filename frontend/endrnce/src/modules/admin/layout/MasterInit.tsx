import React, { FC, useContext, useEffect, useRef } from "react";
import { Tab, Tooltip } from "bootstrap";

import { LayoutContext } from "@modules/admin/layout/context/layout-context";
import {
    DrawerComponent,
    MenuComponent, ScrollComponent,
    ScrollTopComponent,
    StickyComponent, SwapperComponent,
    ToggleComponent
} from "@assets/ts/components";
import { ThemeModeComponent } from "@assets/ts/layout";

const MasterInit: FC = () => {
    const { config } = useContext(LayoutContext);
    const isFirstRun = useRef(true);

    const pluginsInitialization = () => {
        isFirstRun.current = false;
        ThemeModeComponent.init();
        setTimeout(() => {
            ToggleComponent.bootstrap();
            ScrollTopComponent.bootstrap();
            DrawerComponent.bootstrap();
            StickyComponent.bootstrap();
            MenuComponent.bootstrap();
            ScrollComponent.bootstrap();
            SwapperComponent.bootstrap();

            document.querySelectorAll("[data-bs-toggle=\"tab\"]").forEach((tab) => {
                Tab.getOrCreateInstance(tab);
            });

            document.querySelectorAll("[data-bs-toggle=\"tooltip\"]").forEach((tooltip) => {
                Tooltip.getOrCreateInstance(tooltip);
            });
        }, 1000);
    };

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            pluginsInitialization();
        }
    }, [config]);

    return <></>;
};

export default MasterInit;
