/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { ChartsWidgetStackedColumn } from "@components/widget/apex-charts/ChartsWidgetStackedColumn";
import { getCSSVariableValue } from "@assets/ts/_utils";
import { RequestData } from "@library/HttpClient";
import { allureService } from "@services/AllureService";
import { SuiteResponseModel } from "@services/model/payload/response/allure/SuiteResponseModel";
import { SeriesModel } from "@components/widget/apex-charts/model/SeriesModel";
import { TestResultContext } from "@modules/main/dashboards/test-results/context/test-result-context";

const TestResultsHistoryChart: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { environment, ci, setLastSuite } = useContext(TestResultContext);
    const intl = useIntl();
    const [suiteHistory, setSuiteHistory] = useState<SuiteResponseModel[]>([]);
    const [categories, setCategories] = useState<object[]>([]);
    const [series, setSeries] = useState<SeriesModel[]>([]);

    const successColor = getCSSVariableValue("--bs-teal");
    const failedColor = getCSSVariableValue("--bs-red");
    const brokenColor = getCSSVariableValue("--bs-orange");
    const skippedColor = getCSSVariableValue("--bs-gray");
    const unknownColor = getCSSVariableValue("--bs-purple");

    const colors = [
        successColor,
        failedColor,
        brokenColor,
        skippedColor,
        unknownColor
    ];

    useEffect(() => {
        if(environment) {
            (async () => allureSuiteHistory())();
        }
        else {
            setSeries([]);
            setCategories([]);
            setLastSuite(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment, ci]);

    useEffect(() => {
        if(searchParams.get("suiteId") && environment)
            (async () => allureSuiteHistory())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        if(!suiteHistory)
            return;

        setLastSuite(suiteHistory[suiteHistory.length -1]);

        const success: SeriesModel = {
            name: intl.formatMessage({ id: "Success" }),
            data: suiteHistory.map(a => a.passed)
        };
        const failed = {
            name: intl.formatMessage({ id: "Failed" }),
            data: suiteHistory.map(a => a.failed)
        };
        const broken = {
            name: intl.formatMessage({ id: "Broken" }),
            data: suiteHistory.map(a => a.broken)
        };
        const unknown = {
            name: intl.formatMessage({ id: "Unknown" }),
            data: suiteHistory.map(a => a.unknown)
        };

        setSeries([ success, failed, broken, unknown]);

        setCategories(suiteHistory.map(data => [data.name, data.id]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suiteHistory]);

    const allureSuiteHistory = async () =>
    {
        const request: RequestData<SuiteResponseModel[]> = {
            successCallback: (response) => {
                setSuiteHistory(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.message);
            }
        };
        const suiteId: string = searchParams.get("suiteId") === null ? "0" : searchParams.get("suiteId") as string;
        await allureService.getInstance().getSuiteHistory(request, environment?.id, ci?.id, parseInt(suiteId, 10));
    };

    return (
        <>
            <ChartsWidgetStackedColumn className='card-xl-stretch' chartObj={{ title: intl.formatMessage({ id: "Suite Trend" }), colors, series: series, categories }} />
        </>
    );
};

export default TestResultsHistoryChart;
