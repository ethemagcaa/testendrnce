import {
    ILayout,
    ILayoutCSSClasses,
    ILayoutCSSVariables,
    ILayoutHTMLAttributes, LayoutType, ToolbarType
} from "@modules/admin/layout/model/LayoutModels";
import { LayoutSetup } from "@modules/admin/layout/core/LayoutSetup";

export interface LayoutContextModel {
    config: ILayout
    classes: ILayoutCSSClasses
    attributes: ILayoutHTMLAttributes
    cssVariables: ILayoutCSSVariables
    setLayout: (config: LayoutSetup) => void
    setLayoutType: (layoutType: LayoutType) => void
    setToolbarType: (toolbarType: ToolbarType) => void
}
