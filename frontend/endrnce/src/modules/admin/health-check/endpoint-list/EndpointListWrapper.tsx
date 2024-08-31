import React, { FC } from "react";

import {
    EndpointListProvider
} from "@modules/admin/health-check/endpoint-list/context/endpoint-list-context";
import { EndpointList } from "@modules/admin/health-check/endpoint-list/components/EndpointList";

const EndpointListWrapper: FC = () => {
    return (
        <EndpointListProvider>
            <EndpointList />
        </EndpointListProvider>
    );
};

export { EndpointListWrapper };
