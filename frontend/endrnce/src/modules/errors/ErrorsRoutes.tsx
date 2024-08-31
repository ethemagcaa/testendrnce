import React, { FC } from "react";
import { Route, Routes, } from "react-router-dom";

import Error404 from "@modules/errors/components/Error404";
import Error500 from "@modules/errors/components/Error500";
import ErrorsLayout from "@modules/errors/ErrorsLayout";

const ErrorsRoutes: FC = () => (
    <Routes>
        <Route element={<ErrorsLayout />}>
            <Route path="404" element={<Error404 />} />
            <Route path="500" element={<Error500 />} />
            <Route index element={<Error404 />} />
        </Route>
    </Routes>
);

export default ErrorsRoutes;
