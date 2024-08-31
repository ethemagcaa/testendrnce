import React, { FC } from "react";
import { DataTableSearch } from "@components/data-table/components/search/DataTableSearch";
import { DataTableSettings } from "@components/data-table/components/settings/DataTableSettings";
import { Button } from "@components/button/Button";
import { adminRoutes } from "@/constants/routeConstants";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";


const UsersTableHeader: FC = () => {
    const navigate = useNavigate();
    return (
        <div className='card-header border-0 pt-6'>
            <DataTableSearch />
            <div className='card-toolbar'>
                <Button baseColor={"primary"} className={"me-2"} onClick={() => navigate(adminRoutes.users.child.userForm)}>
                    <i className="bi bi-plus-square-fill"></i>
                    <FormattedMessage id="Add User" />
                </Button>
                <DataTableSettings />
            </div>
        </div>
    );
};

export { UsersTableHeader };
