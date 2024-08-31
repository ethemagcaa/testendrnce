import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { WithChildren } from "@library/Types";
import { healthCheckService } from "@services/HealthCheckService";

import { VendorRequestModel } from "@services/model/payload/request/health-check/VendorRequestModel";

interface IContextModel {
    vendorData: VendorRequestModel | null
}

const initialProps: IContextModel = {
    vendorData: null
};
const EndpointListContext = React.createContext(initialProps);

const EndpointListProvider: FC<WithChildren> = ({ children }) => {
    const [vendorData, setVendorData] = useState<VendorRequestModel | null>(null);
    const { vendorId } = useParams<{ vendorId: string }>();

    useEffect(() => {
        (async () => setVendorData(await getVendorDetail(vendorId || "")))();
    }, [vendorId]);

    const getVendorDetail = async (vendorId: string): Promise<VendorRequestModel> => {
        return await healthCheckService.getInstance().getVendorById(vendorId);
    };

    return (
        <EndpointListContext.Provider value={{ vendorData }}>
            {children}
        </EndpointListContext.Provider>
    );
};

export {
    EndpointListProvider,
    EndpointListContext,
};
