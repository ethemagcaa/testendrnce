import React, { FC } from "react";
import SVG from "react-inlinesvg";

import useAsset from "@hooks/use-asset";

type Props = {
    className?: string
    path: string
    svgClassName?: string
}

const Svg: FC<Props> = ({ className = "", path, svgClassName = "mh-50px" }) => {
    const toAbsoluteUrl = useAsset();

    return (
        <span className={`svg-icon ${className}`}>
            <SVG src={toAbsoluteUrl(path)} className={svgClassName} />
        </span>
    );
};

export { Svg };
