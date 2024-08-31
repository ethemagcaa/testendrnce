import React, { useEffect, useState } from "react";
import moment from "moment";
import { AxiosError } from "axios";
import { useIntl } from "react-intl";
import toast from "react-hot-toast";

import { HistoryResponseModel } from "@services/model/payload/response/cucumber/HistoryResponseModel";
import { SeriesModel } from "@components/widget/apex-charts/model/SeriesModel";
import { RequestData } from "@library/HttpClient";
import { cucumberService } from "@services/CucumberService";
import { ChartsWidgetLine } from "@components/widget/apex-charts/ChartsWidgetLine";

const CucumberHistoryCharts: React.FC = () => {
    const intl = useIntl();
    const [history, setHistory] = useState<HistoryResponseModel[]>([]);
    const [seriesFeature, setSeriesFeature] = useState<SeriesModel>();
    const [seriesTestCase, setSeriesTestCase] = useState<SeriesModel>();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if(history.length == 0)
            return;

        setSeriesFeature({
            name: intl.formatMessage({ id: "Feature Count" }),
            data: history.map(a => a.featureCount)
        });

        setSeriesTestCase({
            name: intl.formatMessage({ id: "Test Case Count" }),
            data: history.map(a => a.testCaseCount)
        });

        setCategories(history.map(data => moment(data.addingDate).format("MMM Do YY")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    useEffect(() => {
        (async () => gherkinHistory())();
    }, []);

    const gherkinHistory = async () =>
    {
        const request: RequestData<HistoryResponseModel[]> = {
            successCallback: (response) => {
                setHistory(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.message);
            }
        };
        await cucumberService.getInstance().getHistory(request);
    };

    return (
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10'>
                <ChartsWidgetLine className='card-xl-stretch' chartObj={{ title: intl.formatMessage({ id: "Feature Trend" }), chartColor: "info", series: seriesFeature, categories }} />
            </div>
            <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10'>
                <ChartsWidgetLine className='card-xl-stretch' chartObj={{ title: intl.formatMessage({ id: "Test Case Trend" }), chartColor: "warning", series: seriesTestCase, categories }} />
            </div>
        </div>
    );
};

export default  React.memo(CucumberHistoryCharts);
