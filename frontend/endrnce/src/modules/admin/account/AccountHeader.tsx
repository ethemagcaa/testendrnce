import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

import { adminRoutes } from "@/constants/routeConstants";

const AccountHeader: FC = () => {
    const location = useLocation();

    return (
        <div className='card mb-5 mb-xl-10'>
            <div className='card-body pt-9 pb-0'>
                <div className='d-flex overflow-auto h-55px'>
                    <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                        <li className='nav-item'>
                            <Link
                                className={
                                    "nav-link text-active-primary me-6 " +
                                    (location.pathname === "/account/overview" && "active")
                                }
                                to='/account/overview'
                            >
                                Overview
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                className={
                                    "nav-link text-active-primary me-6 " +
                                    (location.pathname === adminRoutes.accountSettings && "active")
                                }
                                to={adminRoutes.accountSettings}
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export { AccountHeader };
