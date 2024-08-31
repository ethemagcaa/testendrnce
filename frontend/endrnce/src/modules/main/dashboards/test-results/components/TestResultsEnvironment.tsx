import React, { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { RequestData } from "@library/HttpClient";
import { allureService } from "@services/AllureService";
import { TestResultContext } from "@modules/main/dashboards/test-results/context/test-result-context";
import { SuiteEnvironmentResponseModel } from "@services/model/payload/response/allure/SuiteEnvironmentResponseModel";

const TestResultsEnvironment: FC = () => {
    const { lastSuite } = useContext(TestResultContext);
    const intl = useIntl();
    const [suiteEnvironments, setSuiteEnvironments] = useState<SuiteEnvironmentResponseModel[]>([]);

    useEffect(() => {
        if (lastSuite)
            (async () => allureSuiteEnvironment())();
        else
            setSuiteEnvironments([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSuite]);

    const allureSuiteEnvironment = async () => {
        const request: RequestData<SuiteEnvironmentResponseModel[]> = {
            successCallback: (response) => {
                setSuiteEnvironments(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.message);
            }
        };
        await allureService.getInstance().getSuiteEnvironment(request, lastSuite?.id);
    };

    return (
        <div className="card card-flush h-lg-50">
            <div className="card-header pt-5">
                <h3 className="card-title text-gray-800 fw-bold">{intl.formatMessage({ id: "Environment" })}</h3>
            </div>

            <div className="card-body pt-5">
                {suiteEnvironments.map(function(suiteEnvironment, i){
                    return (
                        <div key={i} >
                            <div className="d-flex flex-stack">
                                <div className="text-primary fw-semibold fs-6 me-2">
                                    {suiteEnvironment.name}
                                </div>
                                <div className="btn-active-color-primary justify-content-end">
                                    {JSON.parse(suiteEnvironment.value).toString()}
                                </div>
                            </div>

                            <div className="separator separator-dashed my-3"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestResultsEnvironment;
