import React, { FC } from "react";
import { WithChildren } from "@library/Types";

type Props = {
    className: string
    id: string
}

const TabPane: FC<Props & WithChildren> = ({ children, className, id }) => {

    return (
        <div className={className} id={id}>
            <div className='table-responsive'>
                {children}
            </div>
        </div>
    );
};

export { TabPane };
