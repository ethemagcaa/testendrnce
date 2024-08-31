/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import React, { createContext, FC, useEffect, useState } from "react";

import { WithChildren } from "@library/Types";
import { LayoutContextModel } from "@modules/admin/layout/model/LayoutContextModel";
import DefaultLayoutConfig from "@modules/admin/layout/core/DefaultLayoutConfig";
import {
    getEmptyCssClasses,
    getEmptyCSSVariables,
    getEmptyHTMLAttributes,
    LayoutSetup, setLayoutIntoLocalStorage
} from "@modules/admin/layout/core/LayoutSetup";
import { ILayout, LayoutType, ToolbarType } from "@modules/admin/layout/model/LayoutModels";

const LayoutContext = createContext<LayoutContextModel>({
    config: DefaultLayoutConfig,
    classes: getEmptyCssClasses(),
    attributes: getEmptyHTMLAttributes(),
    cssVariables: getEmptyCSSVariables(),
    setLayout: (config: LayoutSetup) => {},
    setLayoutType: (layoutType: LayoutType) => {},
    setToolbarType: (toolbarType: ToolbarType) => {},
});

const enableSplashScreen = () => {
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen)
        splashScreen.style.setProperty("display", "flex");

};

const disableSplashScreen = () => {
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen)
        splashScreen.style.setProperty("display", "none");

};

const LayoutProvider: FC<WithChildren> = ({ children }) => {
    const [config, setConfig] = useState(LayoutSetup.config);
    const [classes, setClasses] = useState(LayoutSetup.classes);
    const [attributes, setAttributes] = useState(LayoutSetup.attributes);
    const [cssVariables, setCSSVariables] = useState(LayoutSetup.cssVariables);

    const setLayout = (_themeConfig: Partial<ILayout>) => {
        enableSplashScreen();

        const bodyClasses = Array.from(document.body.classList);
        bodyClasses.forEach((cl) => document.body.classList.remove(cl));
        const updatedConfig = LayoutSetup.updatePartialConfig(_themeConfig);

        setConfig(Object.assign({}, updatedConfig));
        setClasses(LayoutSetup.classes);
        setAttributes(LayoutSetup.attributes);
        setCSSVariables(LayoutSetup.cssVariables);

        setTimeout(() => {
            disableSplashScreen();
        }, 500);
    };

    const setToolbarType = (toolbarType: ToolbarType) => {
        const updatedConfig = { ...config };

        if (updatedConfig.app?.toolbar)
            updatedConfig.app.toolbar.layout = toolbarType;

        setLayoutIntoLocalStorage(updatedConfig);
        window.location.reload();
    };

    const setLayoutType = (layoutType: LayoutType) => {
        const updatedLayout = { ...config, layoutType };

        setLayoutIntoLocalStorage(updatedLayout);
        window.location.reload();
    };

    const value: LayoutContextModel = {
        config,
        classes,
        attributes,
        cssVariables,
        setLayout,
        setLayoutType,
        setToolbarType,
    };

    useEffect(() => {
        disableSplashScreen();
    }, []);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

export { LayoutContext, LayoutProvider };
