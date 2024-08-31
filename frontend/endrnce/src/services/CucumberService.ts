import { isAxiosError } from "axios";

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { QueryResponseModel } from "@components/data-table/model/QueryResponseModel";
import { UserQueryResponseModel } from "@services/model/payload/response/user/UserQueryResponseModel";
import { TagResponseModel } from "@services/model/payload/response/cucumber/TagResponseModel";
import { TestStepResponseModel } from "@services/model/payload/response/cucumber/TestStepResponseModel";
import { FeatureResponseModel } from "@services/model/payload/response/cucumber/FeatureResponseModel";
import { PopularTagsResponseModel } from "@services/model/payload/response/cucumber/PopularTagsResponseModel";
import { ScenarioResponseModel } from "@services/model/payload/response/cucumber/ScenarioResponseModel";
import { BaseResponseModel } from "@services/model/payload/response/BaseResponseModel";
import { HistoryResponseModel } from "@services/model/payload/response/cucumber/HistoryResponseModel";
import { ServerTypeProps } from "@modules/main/dashboards/cucumber-board/types/server-type";
import { JobNameType } from "@modules/main/dashboards/cucumber-board/types/job-name-type";

class CucumberService extends HttpClient {
    private static classInstance: CucumberService;

    private constructor() {
        super({
            baseURL: `${ENDRNCE_SERVICE_API}/cucumber`,
        });
    }

    public static getInstance() {
        if (!CucumberService.classInstance)
            CucumberService.classInstance = new CucumberService();

        return this.classInstance;
    }

    public async getTestCaseQuery(query: string, serverTypeProps: ServerTypeProps, jobName: JobNameType | null): Promise<QueryResponseModel<Array<UserQueryResponseModel>>> {
        const response = await this.instance.get<QueryResponseModel<Array<UserQueryResponseModel>>>(`/query?${query}${serverTypeProps.isEnterprise ?
            "&isEnterprise=true" : ""}${serverTypeProps.isExcludeEnterpriseBsg ?
            "&isExcludeEnterpriseBsg=true" : ""}${serverTypeProps.isBsgOnly ?
            "&isBsgOnly=true" : ""}${jobName ? `&is${jobName.name}=true` : ""}`);

        return response.data;
    }

    public async getTags(options: RequestData<Array<TagResponseModel>>, isEnterprise?: boolean): Promise<void> {
        try {
            const response = await this.instance.get<string>(`/tags${isEnterprise ?
                "?isEnterprise=true" : ""}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getPopularTags(options: RequestData<PopularTagsResponseModel>, serverTypeProps: ServerTypeProps) {
        try {
            const response = await this.instance.get(`/tags/popular-top5${serverTypeProps.isEnterprise ?
                "?isEnterprise=true" : ""}${serverTypeProps.isExcludeEnterpriseBsg ?
                "?isExcludeEnterpriseBsg=true" : ""}${serverTypeProps.isBsgOnly ?
                "?isBsgOnly=true" : ""}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getScenarios(options: RequestData<Array<ScenarioResponseModel>>, isEnterprise?: boolean) {
        try {
            const response = await this.instance.get<Array<ScenarioResponseModel>>(`/scenario${isEnterprise ?
                "?isEnterprise=true" : ""}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getTestSteps(options: RequestData<Array<TestStepResponseModel>>, id: number): Promise<void> {
        try {
            const response = await this.instance.get<Array<TestStepResponseModel>>(`/scenario/${id}/test-steps`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getStepCount(options: RequestData<BaseResponseModel>, isEnterprise?: boolean) {
        try {
            const response = await this.instance.get<BaseResponseModel>(`/scenario/test-steps/count${isEnterprise ?
                "?isEnterprise=true" : ""}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getFeatures(options: RequestData<Array<FeatureResponseModel>>, serverTypeProps: ServerTypeProps, jobName: JobNameType | null): Promise<void> {
        try {
            const response = await this.instance.get<Array<FeatureResponseModel>>(`/feature${serverTypeProps.isEnterprise ?
                "?isEnterprise=true" : ""}${serverTypeProps.isExcludeEnterpriseBsg ?
                "?isExcludeEnterpriseBsg=true" : ""}${serverTypeProps.isBsgOnly ?
                "?isBsgOnly=true" : ""}${jobName ? `?is${jobName.name}=true` : ""}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getHistory(options: RequestData<HistoryResponseModel[]>) {
        try {
            const response = await this.instance.get("/history");
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const cucumberService = CucumberService;

export { cucumberService };
