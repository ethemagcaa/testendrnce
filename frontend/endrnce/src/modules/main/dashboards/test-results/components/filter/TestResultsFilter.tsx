import React, { FC, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { RequestData } from "@library/HttpClient";
import { allureService } from "@services/AllureService";
import { EnvironmentResponseModel } from "@services/model/payload/response/allure/EnvironmentResponseModel";
import { CiResponseModel } from "@services/model/payload/response/allure/CiResponseModel";
import { TestResultContext } from "@modules/main/dashboards/test-results/context/test-result-context";

const TestResultsFilter: FC = () => {
    const [dateState, setDateState] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const { environment, setEnvironment, ci, setCi } = useContext(TestResultContext);
    const [environmentList, setEnvironmentList] = useState<EnvironmentResponseModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [ciList, setCiList] = useState<CiResponseModel[]>([]);
    const [isLoadingCi, setIsLoadingCi] = useState<boolean>(false);
    const [isDisabledCi, setIsDisabledCi] = useState<boolean>(true);

    useEffect(() => {
        (async () => getEnvironmentList())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCiList([]);
        setCi(null);

        if (environment) {
            setIsLoadingCi(true);
            setIsDisabledCi(false);
            searchParams.set("environment", environment.name);
            setSearchParams(searchParams);
            (async () => getCiList())();
        } else {
            setIsDisabledCi(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment]);

    useEffect(() => {
        if (ci) {
            searchParams.set("ci", ci.name);
            setSearchParams(searchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ci]);

    const getEnvironmentList = async () => {
        const request: RequestData<EnvironmentResponseModel[]> = {
            successCallback: (response: EnvironmentResponseModel[]) => {
                setEnvironmentList(response);

                setEnvironment(response.filter(data => data.name === searchParams.get("environment"))[0]);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await allureService.getInstance().getEnvironmentList(request);

        setIsLoading(false);
    };

    const getCiList = async () => {
        const request: RequestData<CiResponseModel[]> = {
            successCallback: (response: CiResponseModel[]) => {
                setCiList(response);

                const selectCi = response.filter(data => data.name === searchParams.get("ci"))[0];
                setCi(selectCi === undefined ? null : selectCi);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await allureService.getInstance().getCiList(request, environment?.id);

        setIsLoadingCi(false);
    };

    const changeEnvironmentHandler = (selected: EnvironmentResponseModel | null) => {
        setEnvironment(selected);

        if (!selected)
            searchParams.delete("environment");

        searchParams.delete("ci");
        searchParams.delete("suiteId");
        setSearchParams(searchParams);
    };

    const changeCiHandler = (selected: CiResponseModel | null) => {
        setCi(selected);

        if (!selected) {
            searchParams.delete("ci");
            setSearchParams(searchParams);
        }
    };

    return (
        <div className={"card mb-7"}>
            <div className={"card-body"}>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-shrink-0">
                        <span
                            className="fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block">Environment :</span>
                        <div className="flex-shrink-0">
                            <Select
                                value={environment}
                                onChange={changeEnvironmentHandler}
                                options={environmentList}
                                isSearchable
                                isClearable
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id.toString()}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                    <div className="bullet bg-gradient h-35px w-1px mx-5"></div>
                    <div className="d-flex align-items-center">
                        <span className="fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block">CI/CD :</span>
                        <div className="flex-shrink-0">
                            <Select
                                value={ci}
                                onChange={changeCiHandler}
                                options={ciList}
                                isSearchable
                                isClearable
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id.toString()}
                                isLoading={isLoadingCi}
                                isDisabled={isDisabledCi}
                            />
                        </div>
                    </div>
                    <div className="bullet bg-gradient h-35px w-1px mx-5"></div>
                    <div className="d-flex align-items-center">
                        <span
                            className="fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block">Date Range :</span>
                        <Flatpickr
                            value={dateState.date}
                            onChange={([startDate, endDate]) => {
                                setDateState({ startDate, endDate });
                            }}
                            options={{
                                mode: "range"
                            }}
                            className="form-control form-control-solid"
                            placeholder="Pick date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResultsFilter;
