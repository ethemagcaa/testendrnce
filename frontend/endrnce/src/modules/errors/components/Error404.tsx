import React, { FC } from "react";

import { FormattedMessage } from "react-intl";

const Error404: FC = () => (
    <>
        <h1 className="fw-bolder fs-4x text-gray-700 mb-10">
            <FormattedMessage id="Page Not Found" />
        </h1>

        <div className="fw-bold fs-3 text-gray-400 mb-15">
            <FormattedMessage id="The page you looked not found!" />
        </div>
    </>
);

export default Error404;
