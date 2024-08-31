/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import React, { createContext, FC, useState } from "react";

import { PageDataContextModel } from "@modules/admin/layout/model/PageDataContextModel";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { WithChildren } from "@library/Types";

const PageDataContext = createContext<PageDataContextModel>({
    setPageTitle: (_title: string) => {},
    setPageBreadcrumbs: (_breadcrumbs: Array<PageLinkModel>) => {},
    setPageDescription: (_description: string) => {},
});

const PageDataProvider: FC<WithChildren> = ({ children }) => {
    const [pageTitle, setPageTitle] = useState<string>("");
    const [pageDescription, setPageDescription] = useState<string>("");
    const [pageBreadcrumbs, setPageBreadcrumbs] = useState<Array<PageLinkModel>>([]);

    const value: PageDataContextModel = {
        pageTitle,
        setPageTitle,
        pageDescription,
        setPageDescription,
        pageBreadcrumbs,
        setPageBreadcrumbs,
    };

    return (
        <PageDataContext.Provider value={value}>
            {children}
        </PageDataContext.Provider>
    );
};

export { PageDataContext, PageDataProvider };
