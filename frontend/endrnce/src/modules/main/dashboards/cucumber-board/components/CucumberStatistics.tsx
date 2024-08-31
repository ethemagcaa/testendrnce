import React, { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";

import { RequestData } from "@library/HttpClient";
import { cucumberService } from "@services/CucumberService";
import { FeatureResponseModel } from "@services/model/payload/response/cucumber/FeatureResponseModel";
import { ScenarioResponseModel } from "@services/model/payload/response/cucumber/ScenarioResponseModel";
import { BaseResponseModel } from "@services/model/payload/response/BaseResponseModel";
import { CardsWidget20 } from "@components/widget/cards/CardsWidget20";
import { useIntl } from "react-intl";
import toast from "react-hot-toast";
import { TagsWithPalette , TagsContext } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { TagResponseModel } from "@services/model/payload/response/cucumber/TagResponseModel";

type Props = {
    isEnterprise?: boolean
}

const CucumberStatistics: FC<Props> = ({ isEnterprise }) => {
    const intl = useIntl();
    const { tags } = useContext(TagsContext);
    const [tagsEnterprise, setTagsEnterprise] = useState<TagsWithPalette[]>([]);
    const [features, setFeatures] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [steps, setSteps] = useState<BaseResponseModel>({ message: "0" });

    useEffect(() => {
        (async () => {
            await getFeatures();
            await getScenarios();
            await getScenarioSteps();
            if (isEnterprise)
                await getTagsEnterprise();

        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const errorCallback = (error: AxiosError) => {
        toast.error(error.message);
    };

    const getFeatures = async () => {
        const request: RequestData<FeatureResponseModel[]> = {
            successCallback: (response) => {
                setFeatures(response);
            },
            errorCallback
        };
        await cucumberService.getInstance().getFeatures(request, { isEnterprise }, null);
    };

    const getScenarios = async () => {
        const request: RequestData<ScenarioResponseModel[]> = {
            successCallback: (response) => {
                setScenarios(response);
            },
            errorCallback
        };
        await cucumberService.getInstance().getScenarios(request, isEnterprise);
    };

    const getScenarioSteps = async () => {
        const request: RequestData<BaseResponseModel> = {
            successCallback: (response) => {
                setSteps(response);
            },
            errorCallback
        };
        await cucumberService.getInstance().getStepCount(request, isEnterprise);
    };

    const getTagsEnterprise = async () => {
        const request: RequestData<TagResponseModel[]> = {
            successCallback: (response) => {
                setTagsEnterprise(response);
            },
            errorCallback
        };
        await cucumberService.getInstance().getTags(request, isEnterprise);
    };

    return (
        <div className='row'>
            <div
                className='col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget20
                    className={"badge-info h-md-100 mb-5 mb-xl-10"}
                    description={intl.formatMessage({ id: "Features" })}
                    value={features.length}
                />
            </div>
            <div
                className='col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget20
                    className={"badge-warning h-md-100 mb-5 mb-xl-10"}
                    description={intl.formatMessage({ id: "Test Cases" })}
                    value={scenarios.length}
                />
            </div>
            <div
                className='col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget20
                    className={"badge-secondary h-md-100 mb-5 mb-xl-10"}
                    description={intl.formatMessage({ id: "Test Steps" })}
                    value={parseInt(steps.message)}
                />
            </div>
            <div
                className='col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget20
                    className={"badge-primary h-md-100 mb-5 mb-xl-10"}
                    description={intl.formatMessage({ id: "Tags" })}
                    value={isEnterprise ? tagsEnterprise.length : tags.length}
                />
            </div>
        </div>
    );
};

export { CucumberStatistics };
