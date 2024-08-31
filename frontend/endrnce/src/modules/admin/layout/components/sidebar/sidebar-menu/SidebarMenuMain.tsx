import React, { FC } from "react";
import { useIntl } from "react-intl";

import SidebarMenuItem from "@modules/admin/layout/components/sidebar/sidebar-menu/SidebarMenuItem";
import { adminRoutes } from "@/constants/routeConstants";
import SidebarMenuItemWithSub from "./SidebarMenuItemWithSub";

const SidebarMenuMain: FC = () => {
    const intl = useIntl();

    return (
        <>
            <SidebarMenuItem
                to={adminRoutes.dashboard}
                icon='/media/icons/duotune/art/art002.svg'
                title={intl.formatMessage({ id: "Dashboard" })}
            />
            <div className='menu-item'>
                <div className='menu-content pt-8 pb-2'>
                    <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({ id: "Apps" })}</span>
                </div>
            </div>

            <SidebarMenuItemWithSub
                to={adminRoutes.healthCheck.route}
                title={intl.formatMessage({ id: "Health Check" })}
                icon='/media/icons/duotune/general/gen030.svg'
            >
                <SidebarMenuItem
                    to={adminRoutes.healthCheck.child.environment}
                    icon='/media/icons/duotune/general/gen011.svg'
                    title={intl.formatMessage({ id: "Environment Management" })}
                />
                <SidebarMenuItem
                    to={adminRoutes.healthCheck.child.vendor.route}
                    icon='/media/icons/duotune/general/gen002.svg'
                    title={intl.formatMessage({ id: "Vendor Management" })}
                />
            </SidebarMenuItemWithSub>

            <SidebarMenuItemWithSub
                to={adminRoutes.users.route}
                title={intl.formatMessage({ id: "User Management" })}
                icon='/media/icons/duotune/general/gen051.svg'
            >
                <SidebarMenuItem
                    to={adminRoutes.users.child.user}
                    icon='/media/icons/duotune/general/gen011.svg'
                    title={intl.formatMessage({ id: "User" })}
                />
                <SidebarMenuItem
                    to={adminRoutes.users.child.role}
                    icon='/media/icons/duotune/general/gen002.svg'
                    title={intl.formatMessage({ id: "Role" })}
                />
            </SidebarMenuItemWithSub>

            <SidebarMenuItem
                to={adminRoutes.featureMap}
                icon='/media/icons/duotune/maps/map002.svg'
                title={intl.formatMessage({ id: "Feature Map" })}
            />

        </>
    );
};

export { SidebarMenuMain };
