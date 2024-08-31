/* eslint-disable @typescript-eslint/no-empty-function, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

import { useAppDispatch } from "@hooks/use-redux";
import { authActions } from "@modules/admin/auth/store/auth-slice";
import { AuthStateModel } from "@modules/admin/auth/model/AuthStateModel";
import { AUTHTYPE } from "@modules/admin/auth/enum/AuthType";
import { TokenModel } from "@modules/admin/auth/model/TokenModel";
import { UserModel } from "@modules/admin/auth/model/UserModel";

let logoutTimer: NodeJS.Timeout;

const calculateRemainingTime = (expirationTimeStamp: number): number => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTimeStamp * 1000).getTime();

    return adjExpirationTime - currentTime;
};

const retrieveStoredToken = (): AuthStateModel | null => {
    const tokenJwt = localStorage.getItem("token");
    let token: TokenModel = {
        sub: "0",
        exp: 0,
        iat: 0,
    };
    if (tokenJwt)
        token = jwtDecode<TokenModel>(tokenJwt as string);

    const remainingTime = calculateRemainingTime(token.exp);

    if (remainingTime <= 3600) {
        localStorage.removeItem("token");
        localStorage.removeItem("authType");

        return null;
    }

    const authType: string = localStorage.getItem("authType") || AUTHTYPE.ONSITE;

    return {
        isAuthenticated: true,
        token: tokenJwt || undefined,
        expirationTime: remainingTime,
        authType: AUTHTYPE[authType.toUpperCase() as keyof typeof AUTHTYPE],
    };
};

interface IContextModel {
    login: (authData: AuthStateModel) => void
    logout: (removeToken?: boolean) => void
    currentUser: UserModel | undefined
    tokenData: AuthStateModel | null
    setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
}

const contextDefault: IContextModel = {
    login: () => {},
    logout: (removeToken?: boolean) => {},
    currentUser: undefined,
    tokenData: null,
    setCurrentUser: () => {},
};
const AuthContext = React.createContext(contextDefault);

interface Props {
    children: React.ReactNode;
}

const AuthContextProvider: FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [tokenData, setTokenData] = useState(retrieveStoredToken());
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

    const logoutHandler = useCallback((removeToken = false) => {
        localStorage.removeItem("token");
        localStorage.removeItem("authType");

        dispatch(authActions.logout());

        if(removeToken)
            setTokenData(null);

        if (logoutTimer)
            clearTimeout(logoutTimer);
    }, []);

    const loginHandler = (authData: AuthStateModel) => {
        const authType: string = authData.authType || AUTHTYPE.ONSITE;

        localStorage.setItem("token", authData.token as string);
        localStorage.setItem("authType", authType);

        dispatch(authActions.login(authData));
        setTokenData(retrieveStoredToken());

        const remainingTime = calculateRemainingTime(authData.expirationTime || 0);

        logoutTimer = setTimeout(logoutHandler, remainingTime);

        if(authType !== AUTHTYPE.ONSITE) // for the menu to work
            window.location.reload();
    };

    useEffect(() => {
        if (tokenData?.token && tokenData?.authType && tokenData?.expirationTime) {
            dispatch(authActions.login({
                token: tokenData.token,
                authType: tokenData.authType,
            }));
            localStorage.setItem("token", tokenData.token as string);
            localStorage.setItem("authType", tokenData.authType);

            logoutTimer = setTimeout(logoutHandler, tokenData.expirationTime);
        } else {
            logoutHandler();
        }
    }, [tokenData, logoutHandler]);

    const contextValue: IContextModel = React.useMemo(() => ({
        login: loginHandler,
        logout: logoutHandler,
        currentUser,
        tokenData: tokenData,
        setCurrentUser
    }), [tokenData, logoutTimer]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider, AuthContext };
