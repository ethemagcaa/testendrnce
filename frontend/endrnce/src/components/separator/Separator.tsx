import React, { FC } from "react";
import clsx from "clsx";
import { WithChildren } from "@library/Types";

// Wrapper on html separator:
// https://preview.keenthemes.com/html/metronic/docs/base/separator.html

type Props = {
    className?: string
    content?: boolean
    color?: "light" | "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark" | ""
    style?: "dashed" | "dotted" | ""
    utilityMY?: number
    size?: number
}

const defaultProps: Partial<Props> = {
    className: "",
    content: false,
    color: "",
    style: "",
    utilityMY: 0,
    size: 0
};

const Separator: FC<Props & WithChildren> = (props) => {
    const {
        className,
        color,
        utilityMY,
        children,
        content,
        size,
        style
    } = { ...defaultProps, ...props };

    return (
        <div
            className={clsx(
                "separator",
                className && className,
                {
                    "separator-content": content,
                },
                utilityMY && `my-${utilityMY}`,
                color && `border-${color}`,
                size && `border-${size}`,
                style && `separator-${style}`
            )}
        >
            {content && children}
        </div>
    );
};

export { Separator };
