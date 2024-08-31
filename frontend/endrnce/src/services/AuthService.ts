/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { UserModel } from "@modules/admin/auth/model/UserModel";
import { RegisterRequestModel } from "@modules/admin/auth/model/payload/request/RegisterRequestModel";

class AuthService extends HttpClient {
    private static classInstance: AuthService;

    private constructor() {
        super({
            baseURL: `${ENDRNCE_SERVICE_API}/auth`,
        });
    }

    public static getInstance() {
        if (!AuthService.classInstance)
            AuthService.classInstance = new AuthService();

        return this.classInstance;
    }

    public async login(options: RequestData<object>) {
        try {
            const response = await this.instance.post<string>("/login", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async register(options: RequestData<RegisterRequestModel>) {
        try {
            const response = await this.instance.post<UserModel>("/user", options.data);
            // console.log(response.data);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
        finally {
            options.finallyCallback?.();
        }
    }
}

const authService = AuthService;

export { authService };
