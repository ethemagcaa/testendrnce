import React, { FC } from "react";
import { WithChildren } from "@library/Types";

const Tabs: FC<WithChildren> = ({ children }) => {

    return (
        <div className='card-header border-0 pt-0'>
            <div className='card-toolbar'>
                <ul className='nav'>
                    {children}
                </ul>
            </div>
        </div>
    );
};

export { Tabs };
