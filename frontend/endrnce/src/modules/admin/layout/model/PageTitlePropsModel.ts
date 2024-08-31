import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";

export interface PageTitlePropsModel {
    description?: string
    breadcrumbs?: Array<PageLinkModel>
}
