import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { WithChildren } from "@library/Types";
import { AuthContext } from "@modules/admin/auth/context/auth-context";
import { userService } from "@services/UserService";
import { RequestData } from "@library/HttpClient";
import { UserModel } from "@modules/admin/auth/model/UserModel";
import { LayoutSplashScreen } from "@components/splash-screen/SplashScreen";
import { adminRoutes } from "@/constants/routeConstants";

const AuthInit: FC<WithChildren> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const didRequest = useRef(false);
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentUserRequest: RequestData<never> = {
            successCallback: (response: UserModel) => {
                authContext.setCurrentUser(response);
            },
            errorCallback: (error: AxiosError) => {
                if(!error) {
                    authContext.logout();

                    return;
                }

                if (error.status === 401) {
                    authContext.logout(true);
                    navigate(`${adminRoutes.login}/?err=401`);
                }
                else if (error.status === 403) {
                    authContext.logout(true);
                    navigate(`${adminRoutes.login}/?err=403`);
                }
                else if (error.status === 404) {
                    authContext.logout(true);
                    navigate(`${adminRoutes.login}/?err=404`);
                }
            },
            finallyCallback: () => {
                setShowSplashScreen(false);
            }
        };

        const requestUser = async () => {
            if (!didRequest.current)
                await userService.getInstance().getCurrentUser(getCurrentUserRequest);

            return () => (didRequest.current = true);
        };

        // https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
        (async () => {
            await requestUser();
        })();
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export default AuthInit;
