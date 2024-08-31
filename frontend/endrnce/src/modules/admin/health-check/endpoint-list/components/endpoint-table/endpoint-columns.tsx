import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import { queryClient } from "@react-query/queryClient";
import { queryKeys } from "@react-query/constants/query-keys";

import { EndpointQueryResponseModel } from "@services/model/payload/response/health-check/EndpointQueryResponseModel";
import Badge from "@components/badge/Badge";
import { adminRoutes, generateDynamicPath } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { RequestData } from "@library/HttpClient";
import { healthCheckService } from "@services/HealthCheckService";
import { EndpointRequestModel } from "@services/model/payload/request/health-check/EndpointRequestModel";
import DateFormatter from "@library/DateFormatter";

const endpointColumns = (intl: IntlShape, navigate: NavigateFunction): ColumnDef<EndpointQueryResponseModel>[] => {
    const handleEditEndpoint = (endpoint: EndpointQueryResponseModel) => {
        const route = generateDynamicPath(adminRoutes.healthCheck.child.vendor.child.endpointForm, { vendorId: endpoint.healthCheckVendorId });
        navigate(`${route}/${endpoint.id}`);
    };

    const handleDeleteEndpoint = (endpoint: EndpointQueryResponseModel) => {
        const deleteEndpointRequest: RequestData<EndpointQueryResponseModel> = {
            successCallback: (response: EndpointRequestModel) => {
                toast.success(`${response.name} ${intl.formatMessage({ id:  "is deleted" })}`);

                (async() => await queryClient.invalidateQueries([queryKeys.endpointList]))();
            },
            errorCallback: (error: AxiosError) => {
                if (error && error.status === 403)
                    toast.error(intl.formatMessage({ id: "You don't have enough permission" }));
                else if (error && error.status === 404)
                    toast.error(intl.formatMessage({ id: "Endpoint is not found" }));
                else
                    toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
            }
        };

        (async() => await healthCheckService.getInstance().deleteEndpoint(endpoint.id, deleteEndpointRequest))();
    };

    return  [
        {
            header: intl.formatMessage({ id: "Name" }),
            accessorKey: "name",
            id: "name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Path" }),
            accessorKey: "path",
            id: "path",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Request Type" }),
            accessorKey: "requestType",
            id: "requestType",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Period" }),
            accessorKey: "period",
            id: "period",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Next Run Time" }),
            accessorKey: "nextRunTime",
            id: "nextRunTime",
            cell: info => {
                if(info.getValue()) {
                    const locale = intl.locale;
                    return DateFormatter.changeLocale(locale).format(info.getValue<string>());
                }
            },
        },
        {
            header: intl.formatMessage({ id: "Status" }),
            cell: props => {
                const color = props.row.original.status ? "success" : "danger";
                const label = props.row.original.status ? intl.formatMessage({ id: "Enable" }) : intl.formatMessage({ id: "Disable" });

                return (<Badge color={color}>{label}</Badge>);
            },
        },
        {
            header: intl.formatMessage({ id: "Actions" }),
            accessorKey: "actions",
            id: "actions",
            cell: props => {
                return (
                    <div className="dropdown dropdown-inline">
                        <Button
                            icon={true}
                            activeLight={"primary"}
                            dataBsToggle="tooltip"
                            onClick={() => handleEditEndpoint(props.row.original)}
                            title={intl.formatMessage({ id: "Edit Vendor" })}
                        >
                            <i className="bi bi-pencil-square"/>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => handleDeleteEndpoint(props.row.original)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Delete Vendor" })}
                        >
                            <i className="ki-duotone ki-trash fs-3">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                            </i>
                        </Button>
                    </div>
                );
            }
        }
    ];
};

export { endpointColumns };
