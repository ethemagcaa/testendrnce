import React, { CSSProperties } from "react";

import { getLayoutFromLocalStorage } from "@modules/admin/layout/core/LayoutSetup";
import { icons } from "@components/icon/icons-config/icons";

type Props = {
  className?: string
  iconType?: "duotone" | "solid" | "outline"
  iconName: string,
  style?: CSSProperties
}

const Icon: React.FC<Props> = ({ className = "", iconType, iconName, style }) => {
    if (!iconType)
        iconType = getLayoutFromLocalStorage().main?.iconType;

    return (
        <i className={`ki-${iconType} ki-${iconName}${className && " " + className}`} style={style}>
            {iconType === "duotone" &&
        [...Array(icons[iconName])].map((e, i) => {
            return (
                <span
                    key={`${iconType}-${iconName}-${className}-path-${i + 1}`}
                    className={`path${i + 1}`}
                ></span>
            );
        })}
        </i>
    );
};

export { Icon };
