import React, { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

import { DataTableSearch } from "@components/data-table/components/search/DataTableSearch";
import { DataTableSettings } from "@components/data-table/components/settings/DataTableSettings";
import { Button } from "@components/button/Button";
import { adminRoutes, generateDynamicPath } from "@/constants/routeConstants";
import { EndpointListContext } from "@modules/admin/health-check/endpoint-list/context/endpoint-list-context";

const EndpointTableHeader: FC = () => {
    const { vendorData } = useContext(EndpointListContext);
    const navigate = useNavigate();
    const route = generateDynamicPath(adminRoutes.healthCheck.child.vendor.child.endpointForm, { vendorId: vendorData?.id });

    return (
        <div className='card-header border-0 pt-6'>
            <DataTableSearch />
            <div className='card-toolbar'>
                <Button baseColor={"primary"} className={"me-2"} onClick={() => navigate(route)}>
                    <i className="bi bi-plus-square-fill"></i>
                    <FormattedMessage id="Add Endpoint" />
                </Button>
                <DataTableSettings />
            </div>
        </div>
    );
};

export { EndpointTableHeader };
