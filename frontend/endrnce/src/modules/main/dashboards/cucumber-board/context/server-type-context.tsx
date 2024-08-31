import React, { createContext, FC } from "react";
import { WithChildren } from "@library/Types";
import { ServerTypeProps } from "@modules/main/dashboards/cucumber-board/types/server-type";

const initial: ServerTypeProps = {};

const ServerTypeContext = createContext<ServerTypeProps>(initial);

const ServerTypeProvider: FC<WithChildren & ServerTypeProps> = ({ children, isEnterprise, isExcludeEnterpriseBsg, isBsgOnly }) => {

    return (
        <ServerTypeContext.Provider
            value={{
                isEnterprise,
                isExcludeEnterpriseBsg,
                isBsgOnly
            }}
        >
            {children}
        </ServerTypeContext.Provider>
    );
};

export { ServerTypeProvider, ServerTypeContext };
