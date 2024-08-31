import React, { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { mainRoutes } from "@/constants/routeConstants";
import { EnterpriseBoardHeader } from "@modules/main/dashboards/cucumber-board/components/EnterpriseBoardHeader";
import { Outlet } from "react-router-dom";

const EnterpriseBoard: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Dashboards" }),
            path: mainRoutes.dashboards,
            isSeparator: false,
            isActive: false,
        },
        {
            title: "",
            path: "",
            isSeparator: true,
            isActive: false,
        },
    ];

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: "Enterprise Board" })}
            </PageTitle>
            <EnterpriseBoardHeader />
            <Outlet />
        </>
    );
};

export { EnterpriseBoard };
