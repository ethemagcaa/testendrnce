import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";

export interface PageDataContextModel {
    pageTitle?: string
    setPageTitle: (_title: string) => void
    pageDescription?: string
    setPageDescription: (_description: string) => void
    pageBreadcrumbs?: Array<PageLinkModel>
    setPageBreadcrumbs: (_breadcrumbs: Array<PageLinkModel>) => void
}
