/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { RoleResponseModel } from "@services/model/payload/response/role/RoleResponseModel";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { RoleQueryModel } from "@modules/admin/user-management/role/role-list/model/RoleQueryModel";
import { RoleFormModel } from "@services/model/payload/request/role/RoleFormModel";

class RoleService extends HttpClient {
    private static classInstance: RoleService;

    private constructor() {
        super({
            baseURL: ENDRNCE_SERVICE_API,
        });
    }

    public static getInstance() {
        if (!RoleService.classInstance)
            RoleService.classInstance = new RoleService();

        this.classInstance.initializeRequestInterceptor({
            token: localStorage.getItem("token") as string,
        });

        return this.classInstance;
    }

    public async getCurrentRole(options: RequestData<never>) {
        try {
            const response = await this.instance.get<RoleResponseModel>("/role/me");

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
        finally {
            options.finallyCallback?.();
        }
    }

    public async getRoles(query: string): Promise<QueryResponseModel<Array<RoleQueryModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<RoleQueryModel>>>(`/role/query?${query}`);

        return response.data;
    }

    public async getRoleById(roleId: string): Promise<RoleResponseModel> {
        const response = await this.instance.get<RoleResponseModel>(`/role/${roleId}`);

        return response.data;
    }

    public async createRole(options: RequestData<RoleFormModel>) {
        try {
            const response = await this.instance.post<RoleResponseModel>("/role", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateRole(options: RequestData<RoleFormModel>) {
        try {
            const response = await this.instance.put<RoleResponseModel>("/role", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteRole(roleId: number, options: RequestData<RoleResponseModel>) {
        try {
            const response = await this.instance.delete<RoleResponseModel>(`/role/${roleId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const roleService = RoleService;

export { roleService };
