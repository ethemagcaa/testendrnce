import React from "react";
import { useIntl } from "react-intl";

import { MenuItem } from "@modules/admin/layout/components/header/menu/MenuItem";
import { adminRoutes } from "@/constants/routeConstants";

export function MenuInner() {
    const intl = useIntl();

    return (
        <>
            <MenuItem title={intl.formatMessage({ id: "Dashboard" })} to={adminRoutes.dashboard} />
        </>
    );
}
