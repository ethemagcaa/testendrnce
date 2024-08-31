import React, { FC } from "react";
import clsx from "clsx";
import { WithChildren } from "@library/Types";

type Props = {
    className?: string
    color?: "light" | "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark" | ""
    marginRight?: number
}

const defaultProps: Partial<Props> = {
    className: "",
    color: "",
    marginRight: 1
};

const Badge: FC<Props & WithChildren> = (props) => {
    const {
        className,
        color,
        children,
        marginRight,
    } = { ...defaultProps, ...props };

    return (
        <span
            className={clsx(
                "badge",
                "fw-semibold",
                className && className,
                color && `badge-light-${color}`,
                marginRight && `me-${marginRight}`,
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
