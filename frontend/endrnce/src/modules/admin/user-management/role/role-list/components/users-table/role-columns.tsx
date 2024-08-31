import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl/src/types";

import { RoleQueryModel } from "@modules/admin/user-management/role/role-list/model/RoleQueryModel";
import { adminRoutes } from "@/constants/routeConstants";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@components/button/Button";
import toast from "react-hot-toast";
import { queryKeys } from "@react-query/constants/query-keys";
import { queryClient } from "@react-query/queryClient";
import { AxiosError } from "axios";
import { RequestData } from "@library/HttpClient";
import { RoleResponseModel } from "@services/model/payload/response/role/RoleResponseModel";
import { roleService } from "@services/RoleService";

const rolesColumns = (intl: IntlShape, locale: string, navigate: NavigateFunction): ColumnDef<RoleQueryModel>[] => {
    return  [
        {
            header: intl.formatMessage({ id: "Roles" }),
            accessorKey: "name",
            cell: info => info.getValue<string>()
        },
        {
            header: intl.formatMessage({ id: "Actions" }),
            accessorKey: "actions",
            id: "actions",
            cell: props => {
                const handleDeleteUser = (role: RoleQueryModel) => {
                    const deleteUserRequest: RequestData<RoleResponseModel> = {
                        successCallback: (response: RoleResponseModel) => {
                            toast.success(`${response.name} ${intl.formatMessage({ id:  "is deleted" })}`);

                            (async() => await queryClient.invalidateQueries([queryKeys.rolesList]))();
                        },
                        errorCallback: (error: AxiosError) => {
                            if (error && error.status === 409)
                                toast.error(`${role.roles} ${intl.formatMessage({ id: "has this role. You need to delete role first." })}`);
                            else
                                toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                        }
                    };

                    (async() => await roleService.getInstance().deleteRole(role.id, deleteUserRequest))();
                };

                return (
                    <div className="dropdown dropdown-inline">
                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => navigate(`${adminRoutes.users.child.roleForm}/${props.row.original.id}`)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Edit Role" })}
                        >
                            <i className="bi bi-pencil-square"/>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => handleDeleteUser(props.row.original)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Delete Role" })}
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

export { rolesColumns };
