import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { NavigateFunction } from "react-router-dom";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { healthCheckService } from "@services/HealthCheckService";
import { RequestData } from "@library/HttpClient";
import toast from "react-hot-toast";
import { queryClient } from "@react-query/queryClient";
import { AxiosError } from "axios";
import { queryKeys } from "@react-query/constants/query-keys";
import { EnvironmentQueryResponseModel } from "@services/model/payload/response/health-check/EnvironmentQueryResponseModel";
import { EnvironmenRequestModel } from "@services/model/payload/request/health-check/EnvironmenRequestModel";
import { EnvironmentResponseModel } from "@services/model/payload/response/health-check/EnvironmenResponseModel";

const environmentColumns = (intl: IntlShape, navigate: NavigateFunction): ColumnDef<EnvironmentQueryResponseModel>[] => {
    return [
        {
            header: intl.formatMessage({ id: "Vendor Name" }),
            accessorKey: "vendorName",
            id: "vendorName",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Name" }),
            accessorKey: "environmentKey",
            id: "environmentKey",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Actions" }),
            accessorKey: "actions",
            id: "actions",
            cell: props => {
                const handleDeleteEnvironment = (environment: EnvironmentQueryResponseModel) => {
                    const deleteEnvironmentRequest: RequestData<EnvironmenRequestModel> = {
                        successCallback: (response: EnvironmentResponseModel) => {
                            toast.success(`${response.environmentKey} ${intl.formatMessage({ id:  "is deleted" })}`);

                            (async() => await queryClient.invalidateQueries([queryKeys.environmentList]))();
                        },
                        errorCallback: (error: AxiosError) => {
                            if (error && error.status === 409)
                                toast.error(`${environment.environmentKey} ${intl.formatMessage({ id: "has endpoint(s). You need to delete endpoint(s) first." })}`);
                            else
                                toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                        }
                    };

                    (async() => await healthCheckService.getInstance().deleteEnvironment(environment.id, deleteEnvironmentRequest))();
                };

                return (
                    <div className="dropdown dropdown-inline">
                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => navigate(`${adminRoutes.healthCheck.child.environmentForm}/${props.row.original.id}`)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Edit Environment" })}
                        >
                            <i className="bi bi-pencil-square"/>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => handleDeleteEnvironment(props.row.original)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Delete Environment" })}
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

export { environmentColumns };
