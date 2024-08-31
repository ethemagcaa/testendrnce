import React, { FC } from "react";
import clsx from "clsx";
import { WithChildren } from "@library/Types";

type Props = {
    className?: string
    baseColor?: "light" | "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark"
    light?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark"
    hover?: "elevate-up" | "elevate-down" | "scale" | "rotate-end" | "rotate-start"
    background?: "light" | "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark" | "body"
    outlineDashed?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark"
    color?: "white" | "primary" | "secondary" | "light" | "success" | "info" | "warning" | "danger" | "dark" |
    "muted" | "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" |
    "gray-800" | "gray-900"
    iconandTextColor?: "white" | "primary" | "secondary" | "light" | "success" | "info" | "warning" | "danger" | "dark" |
    "muted" | "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" |
    "gray-800" | "gray-900",
    active?: "light" | "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark",
    activeLight?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark",
    activeColor?: "white" | "primary" | "secondary" | "light" | "success" | "info" | "warning" | "danger" | "dark" |
    "muted" | "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" |
    "gray-800" | "gray-900",
    activeIconandTextColor?: "white" | "primary" | "secondary" | "light" | "success" | "info" | "warning" | "danger" | "dark" |
    "muted" | "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" |
    "gray-800" | "gray-900",
    icon?: boolean,
    social?: "facebook" | "google" | "twitter" | "instagram" | "youtube" | "linkedin",
    socialLight?: "facebook" | "google" | "twitter" | "instagram" | "youtube" | "linkedin",
    link?: boolean,
    flush?: boolean,
    flex?: boolean,
    trimStart?: boolean,
    trimEnd?: boolean,
    utilityME?: number,
    utilityMB?: number,
    onClick?: () => void,
    disabled?: boolean,
    type?: "button" | "submit",
    title?: string,
    dataBsToggle?: string
}

const defaultProps: Partial<Props> = {
    icon: false,
    link: false,
    flush: false,
    flex: false,
    trimStart: false,
    trimEnd: false,
    type: "button"
};

const Button: FC<Props & WithChildren> = (props) => {
    const {
        className,
        baseColor,
        light,
        hover,
        background,
        children,
        outlineDashed,
        color,
        iconandTextColor,
        active,
        activeLight,
        activeColor,
        activeIconandTextColor,
        icon,
        social,
        socialLight,
        link,
        flush,
        flex,
        trimStart,
        trimEnd,
        utilityMB,
        utilityME,
        onClick,
        disabled,
        type,
        title,
        dataBsToggle
    } = { ...defaultProps, ...props };

    return (
        <button
            className={clsx(
                "btn",
                className && className,
                {
                    "btn-icon": icon,
                    "btn-link": link,
                    "btn-flush": flush,
                    "btn-flex": flex,
                    "btn-trim-start": trimStart,
                    "btn-trim-end": trimEnd
                },
                baseColor && `btn-${baseColor}`,
                light && `btn-light-${light}`,
                hover && `hover-${hover}`,
                background && `btn-bg-${background}`,
                outlineDashed && `btn-outline btn-outline-dashed btn-outline-${outlineDashed} btn-active-light-${outlineDashed}`,
                color && `btn-color-${color}`,
                iconandTextColor && `btn-icon-${iconandTextColor} btn-text-${iconandTextColor}`,
                active && `btn-active-${active}`,
                activeLight && `btn-active-light-${activeLight}`,
                activeColor && `btn-active-color-${activeColor}`,
                activeIconandTextColor && `btn-active-icon-${activeIconandTextColor} btn-text-${activeIconandTextColor}`,
                social && `btn-icon btn-${social}`,
                socialLight && `btn-icon btn-light-${socialLight}`,
                utilityME && `me-${utilityME}`,
                utilityMB && `mb-${utilityMB}`
            )}
            disabled={disabled}
            type={type}
            onClick={onClick}
            title={title}
            data-bs-toggle={dataBsToggle}
        >
            {children}
        </button>
    );
};

export { Button };
