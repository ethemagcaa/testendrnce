import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { VendorQueryResponseModel } from "@services/model/payload/response/health-check/VendorQueryResponseModel";
import Badge from "@components/badge/Badge";
import { NavigateFunction } from "react-router-dom";
import { adminRoutes, generateDynamicPath } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { healthCheckService } from "@services/HealthCheckService";
import { RequestData } from "@library/HttpClient";
import { VendorRequestModel } from "@services/model/payload/request/health-check/VendorRequestModel";
import toast from "react-hot-toast";
import { queryClient } from "@react-query/queryClient";
import { AxiosError } from "axios";
import { queryKeys } from "@react-query/constants/query-keys";

const vendorColumns = (intl: IntlShape, navigate: NavigateFunction): ColumnDef<VendorQueryResponseModel>[] => {
    return [
        {
            header: intl.formatMessage({ id: "Name" }),
            accessorKey: "name",
            id: "name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Url" }),
            accessorKey: "url",
            id: "url",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Period" }),
            accessorKey: "period",
            id: "period",
            cell: info => info.getValue()
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
                const handleShowEndpointListClick = () => {
                    const route = generateDynamicPath(adminRoutes.healthCheck.child.vendor.child.endpoint, { vendorId: props.row.original.id });
                    navigate(route);
                };

                const handleDeleteVendor = (vendor: VendorQueryResponseModel) => {
                    const deleteVendorRequest: RequestData<VendorQueryResponseModel> = {
                        successCallback: (response: VendorRequestModel) => {
                            toast.success(`${response.name} ${intl.formatMessage({ id:  "is deleted" })}`);

                            (async() => await queryClient.invalidateQueries([queryKeys.vendorList]))();
                        },
                        errorCallback: (error: AxiosError) => {
                            if (error && error.status === 409)
                                toast.error(`${vendor.name} ${intl.formatMessage({ id: "has endpoint(s). You need to delete endpoint(s) first." })}`);
                            else
                                toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                        }
                    };

                    (async() => await healthCheckService.getInstance().deleteVendor(vendor.id, deleteVendorRequest))();
                };

                return (
                    <div className="dropdown dropdown-inline">
                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => navigate(`${adminRoutes.healthCheck.child.vendorForm}/${props.row.original.id}`)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Edit Vendor" })}
                        >
                            <i className="bi bi-pencil-square"/>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={handleShowEndpointListClick}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Endpoint List" })}
                        >
                            <i className="ki-duotone ki-switch fs-3">
                                <span className="path1"></span>
                                <span className="path2"></span>
                            </i>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => handleDeleteVendor(props.row.original)}
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

export { vendorColumns };
