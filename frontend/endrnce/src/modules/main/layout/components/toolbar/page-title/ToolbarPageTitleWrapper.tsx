import React, { useContext } from "react";

import { LayoutContext } from "@modules/admin/layout/context/layout-context";
import ToolbarPageTitle from "@modules/admin/layout/components/toolbar/page-title/ToolbarPageTitle";

const ToolbarPageTitleWrapper: React.FC = () => {
    const { config } = useContext(LayoutContext);

    if (!config.app?.pageTitle?.display)
        return null;

    return <ToolbarPageTitle />;
};

export default ToolbarPageTitleWrapper;
