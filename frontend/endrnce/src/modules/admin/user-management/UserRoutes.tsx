import React, { FC } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { UsersList } from "@modules/admin/user-management/users-list/UsersList";
import { adminRoutes, getLastSegments } from "@/constants/routeConstants";
import { UserForm } from "@modules/admin/user-management/user-form/UserForm";
import { UserPasswordForm } from "@modules/admin/user-management/user-password-form/UserPasswordForm";
import { RolesList } from "@modules/admin/user-management/role/role-list/RolesList";
import { RoleForm } from "@modules/admin/user-management/role/role-form/RoleForm";

const userRoute = getLastSegments(adminRoutes.users.child.user);
const userFormRoute = getLastSegments(adminRoutes.users.child.userForm);
const userPasswordRoute = getLastSegments(adminRoutes.users.child.passwordForm);
const roleRoute = getLastSegments(adminRoutes.users.child.role);
const roleFormRoute = getLastSegments(adminRoutes.users.child.roleForm);

const UserRoutes: FC = () => (
    <Routes>
        <Route element={<Outlet />}>
            <Route path={userRoute} element={<UsersList />} />
            <Route path={userFormRoute} element={<UserForm />} />
            <Route path={`${userFormRoute}/:userId`} element={<UserForm />} />
            <Route path={`${userPasswordRoute}/:userId`} element={<UserPasswordForm />} />
            <Route path={roleRoute} element={<RolesList />} />
            <Route path={roleFormRoute} element={<RoleForm />} />
            <Route path={`${roleFormRoute}/:roleId`} element={<RoleForm />} />
            <Route index element={<Navigate to={adminRoutes.users.route} />} />
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404'/>}/>
        </Route>
    </Routes>
);

export default UserRoutes;
