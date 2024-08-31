import { isAxiosError } from "axios";

import HttpClient, { RequestData } from "@library/HttpClient";
import { ENDRNCE_SERVICE_API } from "@/constants";
import { EnvironmentResponseModel } from "@services/model/payload/response/allure/EnvironmentResponseModel";
import { CiResponseModel } from "@services/model/payload/response/allure/CiResponseModel";
import { SuiteResponseModel } from "@services/model/payload/response/allure/SuiteResponseModel";
import { SuiteEnvironmentResponseModel } from "@services/model/payload/response/allure/SuiteEnvironmentResponseModel";

class AllureService extends HttpClient {
    private static classInstance: AllureService;

    private constructor() {
        super({
            baseURL: `${ENDRNCE_SERVICE_API}/allure`,
        });
    }

    public static getInstance() {
        if (!AllureService.classInstance)
            AllureService.classInstance = new AllureService();

        return this.classInstance;
    }

    public async getEnvironmentList(options: RequestData<Array<EnvironmentResponseModel>>) {
        try {
            const response = await this.instance.get<Array<EnvironmentResponseModel>>("/environment");
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getCiList(options: RequestData<Array<CiResponseModel>>, environmentId: number | undefined) {
        try {
            const response = await this.instance.get<Array<CiResponseModel>>(`/ci?environmentId=${environmentId}`);
            return options.successCallback(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getSuiteHistory(options: RequestData<SuiteResponseModel[]>, environmentId: number | undefined, ciId: number = 0, suiteId: number = 0)
    {
        try {
            const response = await this.instance.get(`/suite?environmentId=${environmentId}&ciId=${ciId}&suiteId=${suiteId}`);
            return options.successCallback(response.data);
        }catch (error: unknown){
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }

    public async getSuiteEnvironment(options: RequestData<SuiteEnvironmentResponseModel[]>, environmentId: number | undefined)
    {
        try {
            const response = await this.instance.get(`/suite-environment?suiteId=${environmentId}`);
            return options.successCallback(response.data);
        }catch (error: unknown){
            if (isAxiosError(error))
                return options.errorCallback(error.response);
        }
    }
}

const allureService = AllureService;

export { allureService };
