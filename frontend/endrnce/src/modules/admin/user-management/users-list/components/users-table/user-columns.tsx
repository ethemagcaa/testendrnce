import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl/src/types";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { queryClient } from "@react-query/queryClient";
import { AxiosError } from "axios";

import { UserQueryResponseModel } from "@services/model/payload/response/user/UserQueryResponseModel";
import DateFormatter from "@library/DateFormatter";
import { BadgeCell } from "@components/data-table/components/columns/BadgeCell";
import { BadgeArrayCell } from "@components/data-table/components/columns/BadgeArrayCell";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { queryKeys } from "@react-query/constants/query-keys";
import { RequestData } from "@library/HttpClient";
import { userService } from "@services/UserService";
import { UserResponseModel } from "@services/model/payload/response/user/UserResponseModel";

const usersColumns = (intl: IntlShape, locale: string, navigate: NavigateFunction): ColumnDef<UserQueryResponseModel>[] => {
    return  [
        {
            header: intl.formatMessage({ id: "First Name" }),
            accessorKey: "firstName",
            id: "u.first_name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Last Name" }),
            accessorKey: "lastName",
            id: "u.last_name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Email" }),
            accessorKey: "email",
            id: "u.email",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Roles" }),
            accessorKey: "roles",
            cell: info => <BadgeArrayCell arrayList={info.getValue<string>().replaceAll("ROLE_", "").split(" ")} />
        },
        {
            header: intl.formatMessage({ id: "Provider" }),
            accessorKey: "providerTypeName",
            id: "provider_type_name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Last Login" }),
            accessorFn: row => row.lastLoginDate,
            id: "u.last_login_date",
            cell: info => <BadgeCell text={ DateFormatter.changeLocale(locale).fromNow(info.getValue<string>())} />,
        },
        {
            header: intl.formatMessage({ id: "Actions" }),
            accessorKey: "actions",
            id: "actions",
            cell: props => {
                const handleDeleteUser = (user: UserQueryResponseModel) => {
                    const deleteUserRequest: RequestData<UserResponseModel> = {
                        successCallback: (response: UserResponseModel) => {
                            toast.success(`${response.firstName} ${intl.formatMessage({ id:  "is deleted" })}`);

                            (async() => await queryClient.invalidateQueries([queryKeys.usersList]))();
                        },
                        errorCallback: (error: AxiosError) => {
                            if (error && error.status === 409)
                                toast.error(`${user.firstName} ${intl.formatMessage({ id: "has endpoint(s). You need to delete endpoint(s) first." })}`);
                            else
                                toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                        }
                    };

                    (async() => await userService.getInstance().deleteUser(user.id, deleteUserRequest))();
                };

                return (
                    <div className="dropdown dropdown-inline">
                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => navigate(`${adminRoutes.users.child.userForm}/${props.row.original.id}`)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Edit User" })}
                        >
                            <i className="bi bi-pencil-square"/>
                        </Button>



                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => navigate(`${adminRoutes.users.child.passwordForm}/${props.row.original.id}`)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Change Password" })}
                        >
                            <i className="bi bi-lock-fill"/>
                        </Button>

                        <Button
                            icon={true}
                            activeLight={"primary"}
                            className={"w-30px h-30px me-1"}
                            onClick={() => handleDeleteUser(props.row.original)}
                            dataBsToggle={"tooltip"}
                            title={intl.formatMessage({ id: "Delete User" })}
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

export { usersColumns };
