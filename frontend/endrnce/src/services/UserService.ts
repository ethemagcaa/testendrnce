/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { UserResponseModel } from "@services/model/payload/response/user/UserResponseModel";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { UserQueryResponseModel } from "@services/model/payload/response/user/UserQueryResponseModel";
import { UsePasswordModel } from "@services/model/payload/request/user/UserPasswordRequestModel";
import { UserFormRequestModel } from "@services/model/payload/request/user/UserFormRequestModel";

class UserService extends HttpClient {
    private static classInstance: UserService;

    private constructor() {
        super({
            baseURL: ENDRNCE_SERVICE_API,
        });
    }

    public static getInstance() {
        if (!UserService.classInstance)
            UserService.classInstance = new UserService();

        this.classInstance.initializeRequestInterceptor({
            token: localStorage.getItem("token") as string,
        });

        return this.classInstance;
    }

    public async getCurrentUser(options: RequestData<never>) {
        try {
            const response = await this.instance.get<UserResponseModel>("/user/me");

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
        finally {
            options.finallyCallback?.();
        }
    }

    public async getUsers(query: string): Promise<QueryResponseModel<Array<UserQueryResponseModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<UserQueryResponseModel>>>(`/user/query?${query}`);

        return response.data;
    }

    public async getUserById(userId: string): Promise<UserFormRequestModel> {
        const response = await this.instance.get<UserResponseModel>(`/user/${userId}`);

        return {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            providerTypeId: response.data.providerTypeId,
            roleIds: response.data.roles.map(role => role.id)
        };
    }

    public async createUser(options: RequestData<UserFormRequestModel>) {
        try {
            const response = await this.instance.post<UserResponseModel>("/user", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateUser(options: RequestData<UserFormRequestModel>) {
        try {
            const response = await this.instance.put<UserResponseModel>("/user", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateUserPassword(options: RequestData<UsePasswordModel>) {
        try {
            const response = await this.instance.put<UserResponseModel>("/user/password", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteUser(userId: number, options: RequestData<UserResponseModel>) {
        try {
            const response = await this.instance.delete<UserResponseModel>(`/user/${userId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const userService = UserService;

export{ userService };
