import React, { FC } from "react";
import { mainRoutes } from "@/constants/routeConstants";
import { Link, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const EnterpriseBoardHeader: FC = () => {

    const location = useLocation();

    return (
        <div className='d-flex overflow-auto h-35px mb-4'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-4 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                    <Link
                        className={
                            "nav-link text-active-primary me-6 " +
                            (location.pathname === `${mainRoutes.enterprise}/overview` && "active")
                        }
                        to={`${mainRoutes.enterprise}/overview`}
                    >
                        <FormattedMessage id={"Overview"} />
                    </Link>
                    <Link
                        className={
                            "nav-link text-active-primary me-6 " +
                            (location.pathname === `${mainRoutes.enterprise}/test-cases-of-job-names` && "active")
                        }
                        to={`${mainRoutes.enterprise}/test-cases-of-job-names`}
                    >
                        <FormattedMessage id={"Test Cases of Job Names"} />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export { EnterpriseBoardHeader };
