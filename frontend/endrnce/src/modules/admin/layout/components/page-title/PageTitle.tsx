import React, { FC, useContext, useEffect } from "react";

import { PageTitlePropsModel } from "@modules/admin/layout/model/PageTitlePropsModel";
import { WithChildren } from "@library/Types";
import { PageDataContext } from "@modules/admin/layout/context/page-context";

const PageTitle: FC<PageTitlePropsModel & WithChildren> = ({ children, description, breadcrumbs }) => {
    const { setPageTitle, setPageDescription, setPageBreadcrumbs } = useContext(PageDataContext);

    useEffect(() => {
        if (children)
            setPageTitle(children.toString());

        return () => {
            setPageTitle("");
        };
    }, [children, setPageTitle]);

    useEffect(() => {
        if (description)
            setPageDescription(description);

        return () => {
            setPageDescription("");
        };
    }, [description, setPageDescription]);

    useEffect(() => {
        if (breadcrumbs)
            setPageBreadcrumbs(breadcrumbs);

        return () => {
            setPageBreadcrumbs([]);
        };
    }, [breadcrumbs, setPageBreadcrumbs]);

    return <></>;
};

export { PageTitle };
