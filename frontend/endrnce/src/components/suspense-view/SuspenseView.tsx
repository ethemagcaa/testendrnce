import React, { FC, Suspense } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

import { WithChildren } from "@library/Types";
import { getCSSVariableValue } from "@assets/ts/_utils";

const SuspenseView: FC<WithChildren> = ({ children }) => {
    const baseColor = getCSSVariableValue("--bs-primary");

    TopBarProgress.config({
        barColors: {
            "0": baseColor,
        },
        barThickness: 1,
        shadowBlur: 5,
    });

    return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { SuspenseView };
