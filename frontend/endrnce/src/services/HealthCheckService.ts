/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpClient, { RequestData } from "@library/HttpClient";
import { isAxiosError } from "axios";

import { ENDRNCE_SERVICE_API } from "@/constants";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { VendorQueryResponseModel } from "@services/model/payload/response/health-check/VendorQueryResponseModel";
import { HealthCheckQueryModel } from "@modules/main/health-check/model/HealthCheckQueryModel";
import { VendorRequestModel } from "@services/model/payload/request/health-check/VendorRequestModel";
import { EndpointRequestModel } from "@services/model/payload/request/health-check/EndpointRequestModel";
import { EndpointQueryResponseModel } from "@services/model/payload/response/health-check/EndpointQueryResponseModel";
import { EnvironmenRequestModel } from "@services/model/payload/request/health-check/EnvironmenRequestModel";
import { EnvironmentQueryResponseModel } from "@services/model/payload/response/health-check/EnvironmentQueryResponseModel";
import { EndpointResponseModel } from "@services/model/payload/response/health-check/EndpointResponseModel";
import { EnvironmentResponseModel } from "@services/model/payload/response/health-check/EnvironmenResponseModel";
import { VendorResponseModel } from "@services/model/payload/response/health-check/VendorResponseModel";

class HealthCheckService extends HttpClient {
    private static classInstance: HealthCheckService;

    private constructor() {
        super({
            baseURL: `${ENDRNCE_SERVICE_API}/health-check`,
        });
    }

    public static getInstance() {
        if (!HealthCheckService.classInstance)
            HealthCheckService.classInstance = new HealthCheckService();

        this.classInstance.initializeRequestInterceptor({
            token: localStorage.getItem("token") as string,
        });

        return this.classInstance;
    }

    public async getVendor(options: RequestData<Array<VendorRequestModel>>): Promise<void> {
        try {
            const response = await this.instance.get<VendorResponseModel>("/vendor");

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getVendorQuery(query: string): Promise<QueryResponseModel<Array<VendorQueryResponseModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<VendorQueryResponseModel>>>(`/vendor/query?${query}`);

        return response.data;
    }

    public async getHealthCheckQuery(query: string): Promise<QueryResponseModel<Array<HealthCheckQueryModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<HealthCheckQueryModel>>>(`/history/query?${query}`);

        return response.data;
    }

    public async getVendorById(vendorId: string): Promise<VendorRequestModel> {
        const response = await this.instance.get<VendorRequestModel>(`/vendor/${vendorId}`);

        return response.data;
    }

    public async createVendor(options: RequestData<VendorRequestModel>) {
        try {
            const response = await this.instance.post<VendorRequestModel>("/vendor", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateVendor(options: RequestData<VendorRequestModel>) {
        try {
            const response = await this.instance.put<VendorRequestModel>("/vendor", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteVendor(vendorId: number, options: RequestData<VendorRequestModel>) {
        try {
            const response = await this.instance.delete<VendorRequestModel>(`/vendor/${vendorId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getEndpointQuery(query: string, vendorId: number): Promise<QueryResponseModel<Array<EndpointQueryResponseModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<EndpointQueryResponseModel>>>(`vendor/${vendorId}/endpoint/query?${query}`);

        return response.data;
    }

    public async getEndpointById(endpointId: string): Promise<EndpointResponseModel> {
        const response = await this.instance.get<EndpointResponseModel>(`/endpoint/${endpointId}`);

        return response.data;
    }

    public async createEndpoint(options: RequestData<EndpointRequestModel>) {
        try {
            const response = await this.instance.post<EndpointResponseModel>("/endpoint", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateEndpoint(options: RequestData<EndpointRequestModel>) {
        try {
            const response = await this.instance.put<EndpointResponseModel>("/endpoint", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteEndpoint(endpointId: number, options: RequestData<EndpointRequestModel>) {
        try {
            const response = await this.instance.delete<EndpointResponseModel>(`/endpoint/${endpointId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getEnvironmentQuery(query: string): Promise<QueryResponseModel<Array<EnvironmentQueryResponseModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<EnvironmentQueryResponseModel>>>(`environment/query?${query}`);

        return response.data;
    }

    public async getEnvironmentById(environmentId: string): Promise<EnvironmentResponseModel> {
        const response = await this.instance.get<EnvironmentResponseModel>(`/environment/${environmentId}`);

        return response.data;
    }

    public async createEnvironment(options: RequestData<EnvironmenRequestModel>) {
        try {
            const response = await this.instance.post<EnvironmenRequestModel>("/environment", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateEnvironment(options: RequestData<EnvironmenRequestModel>) {
        try {
            const response = await this.instance.put<EnvironmenRequestModel>("/environment", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteEnvironment(environmentId: number, options: RequestData<EnvironmenRequestModel>) {
        try {
            const response = await this.instance.delete<EnvironmentResponseModel>(`/environment/${environmentId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const healthCheckService = HealthCheckService;

export { healthCheckService };


