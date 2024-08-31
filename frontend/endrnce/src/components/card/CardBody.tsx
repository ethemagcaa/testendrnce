import React, { FC } from "react";
import clsx from "clsx";

import { WithChildren } from "@library/Types";

type Props = {
  className?: string
  scroll?: boolean
  height?: number
}

const CardBody: FC<Props & WithChildren> = (props) => {
    const { className, scroll, height, children } = props;

    return (
        <div
            className={clsx(
                "card-body",
                className && className,
                {
                    "card-scroll": scroll,
                },
                height && `h-${height}px`
            )}
        >
            {children}
        </div>
    );
};

export { CardBody };
