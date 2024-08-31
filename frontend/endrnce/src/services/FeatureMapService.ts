/* eslint-disable @typescript-eslint/no-explicit-any */

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { isAxiosError } from "axios";
import { NodeResponseModel } from "@services/model/payload/response/feature-map/NodeResponseModel";
import { NodeDeleteResponseModel } from "@services/model/payload/response/feature-map/NodeDeleteResponseModel";
import { FeatureMapResponseModel } from "@services/model/payload/response/feature-map/FeatureMapResponseModel";

class FeatureMapService extends HttpClient {
    private static classInstance: FeatureMapService;

    private constructor() {
        super({
            baseURL: `${ENDRNCE_SERVICE_API}/feature-map`,
        });
    }

    public static getInstance() {
        if (!FeatureMapService.classInstance)
            FeatureMapService.classInstance = new FeatureMapService();

        this.classInstance.initializeRequestInterceptor({
            token: localStorage.getItem("token") as string,
        });

        return this.classInstance;
    }

    public async getTreeNodes(options: RequestData<Array<NodeResponseModel>>): Promise<void> {
        try {
            const response = await this.instance.get<NodeResponseModel>("/");

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async createNode(options: RequestData<NodeResponseModel>) {
        try {
            const response = await this.instance.post<NodeResponseModel>("/", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async updateNode(options: RequestData<NodeResponseModel>) {
        try {
            const response = await this.instance.put<NodeResponseModel>("/", options.data);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async deleteNode(nodeId: number, options: RequestData<NodeDeleteResponseModel>) {
        try {
            const response = await this.instance.delete<NodeDeleteResponseModel>(`/${nodeId}`);

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getFlowNodes(options: RequestData<Array<FeatureMapResponseModel>>): Promise<void> {
        try {
            const response = await this.instance.get<NodeResponseModel>("/hierarchy");

            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const featureMapService = FeatureMapService;

export { featureMapService };
