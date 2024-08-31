import React, { FC } from "react";

type Props = {
    className: string
    dataBsToggle: string
    href: string
    onClick: () => void
    label: string

}

const Tab: FC<Props> = ({ className, dataBsToggle, onClick, label, href }) => {
    return (
        <li className='nav-item'>
            <a
                className={className}
                data-bs-toggle={dataBsToggle}
                href={href}
                onClick={onClick}
            >
                {label}
            </a>
        </li>
    );
};

export { Tab };
