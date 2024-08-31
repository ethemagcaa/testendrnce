/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { FormattedMessage } from "react-intl";

import { AUTHTYPE } from "@modules/admin/auth/enum/AuthType";
import { TokenModel } from "@modules/admin/auth/model/TokenModel";
import { AuthContext } from "@modules/admin/auth/context/auth-context";

const OAuth2RedirectHandler: FC = () => {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        if (queryParams.get("token") !== null && queryParams.get("provider") !== null) {
            const token = jwtDecode<TokenModel>(queryParams.get("token") as string);
            const provider = queryParams.get("provider") as string;

            authContext.login({
                token: queryParams.get("token") as string,
                expirationTime: token.exp,
                authType: AUTHTYPE[provider.toUpperCase() as keyof typeof AUTHTYPE],
            });
        }
    }, [queryParams]);

    if (typeof queryParams.get("error") !== "undefined")
        return (
            <div className="mb-lg-15 alert alert-danger">
                <FormattedMessage id="Sorry, looks like there are some errors detected, please try again." />
            </div>
        );

    return (
        <></>
    );
};

export default OAuth2RedirectHandler;
