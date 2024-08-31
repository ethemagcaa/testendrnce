import React, { FC } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { adminRoutes, getLastSegments } from "@/constants/routeConstants";
import { VendorList } from "@modules/admin/health-check/vendor-list/VendorList";
import { VendorForm } from "@modules/admin/health-check/vendor-form/VendorForm";
import { EndpointListWrapper } from "@modules/admin/health-check/endpoint-list/EndpointListWrapper";
import { EndpointForm } from "@modules/admin/health-check/endpoint-form/EndpointForm";
import { EnvironmentList } from "@modules/admin/health-check/environment-list/EnvironmentList";
import { EnvironmentForm } from "@modules/admin/health-check/environment-form/EnvironmentForm";

const vendorFormRoute = getLastSegments(adminRoutes.healthCheck.child.vendorForm);
const endpointRoute = getLastSegments(adminRoutes.healthCheck.child.vendor.child.endpoint, 3);
const endpointRouteForm = getLastSegments(adminRoutes.healthCheck.child.vendor.child.endpointForm, 3);

const HealthCheckRoutes: FC = () => (
    <Routes>
        <Route element={<Outlet />}>
            <Route path={getLastSegments(adminRoutes.healthCheck.child.vendor.route)} element={<VendorList />} />
            <Route path={vendorFormRoute} element={<VendorForm />} />
            <Route path={`${vendorFormRoute}/:vendorId`} element={<VendorForm />} />
            <Route path={endpointRoute} element={<EndpointListWrapper />} />
            <Route path={endpointRouteForm} element={<EndpointForm />} />
            <Route path={`${endpointRouteForm}/:endpointId`} element={<EndpointForm />} />
            <Route path={getLastSegments(adminRoutes.healthCheck.child.environment)} element={<EnvironmentList />} />
            <Route path={getLastSegments(adminRoutes.healthCheck.child.environmentForm)} element={<EnvironmentForm />} />
            <Route path={`${getLastSegments(adminRoutes.healthCheck.child.environmentForm)}/:environmentId`} element={<EnvironmentForm />} />
            <Route index element={<Navigate to={adminRoutes.healthCheck.child.vendor.route} />} />
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404'/>}/>
        </Route>
    </Routes>
);

export default HealthCheckRoutes;
