import React, { FC } from "react";

import { FormattedMessage } from "react-intl";

const Error500: FC = () => (
    <>
        <h1 className="fw-bolder fs-4x text-gray-700 mb-10">
            <FormattedMessage id="System Error" />
        </h1>

        <div className="fw-bold fs-3 text-gray-400 mb-15">
            <FormattedMessage id="Something went wrong!" />
        </div>
    </>
);

export default Error500;
