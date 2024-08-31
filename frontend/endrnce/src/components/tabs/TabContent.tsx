import React, { FC } from "react";
import { WithChildren } from "@library/Types";

const TabContent: FC<WithChildren> = ({ children }) => {

    return (
        <div className="card-body py-3">
            <div className="tab-content">
                {children}
            </div>
        </div>
    );
};

export { TabContent };
