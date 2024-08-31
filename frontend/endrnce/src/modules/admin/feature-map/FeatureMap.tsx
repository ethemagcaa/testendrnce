import React, { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { FeatureTree } from "@modules/admin/feature-map/components/FeatureTree";
import { TreeNodeProvider } from "@modules/admin/feature-map/context/tree-node-context";
import { adminRoutes, getLastSegments } from "@/constants/routeConstants";

const FeatureMap: FC = () => {
    const intl = useIntl();
    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Feature Map" }),
            path: getLastSegments(adminRoutes.featureMap),
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
                {intl.formatMessage({ id: "Feature Map" })}
            </PageTitle>
            <TreeNodeProvider>
                <FeatureTree />
            </TreeNodeProvider>
        </>
    );
};

export { FeatureMap };