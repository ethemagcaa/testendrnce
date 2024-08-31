import React, { FC, useContext, useEffect, useState } from "react";
import Select from "react-select";

import { initialQueryState } from "@components/data-table/model/QueryStateModel";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import {
    useTestCaseQueryResponseLoading
} from "@modules/main/dashboards/cucumber-board/context/test-case-query-responsive-context";
import { FeatureResponseModel } from "@services/model/payload/response/cucumber/FeatureResponseModel";
import { MenuComponent } from "@assets/ts/components";
import { RequestData } from "@library/HttpClient";
import { AxiosError } from "axios";
import { cucumberService } from "@services/CucumberService";
import toast from "react-hot-toast";
import { Icon } from "@components/icon/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import { ServerTypeContext } from "@modules/main/dashboards/cucumber-board/context/server-type-context";
import { JobNameContext } from "@modules/main/dashboards/cucumber-board/context/job-name-context";

const TestCaseTableFilter: FC = () => {
    const intl = useIntl();
    const { updateState } = useContext(DataTableContext);
    const { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly } = useContext(ServerTypeContext);
    const isLoading = useTestCaseQueryResponseLoading();
    const [features, setFeatures] = useState<FeatureResponseModel[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<FeatureResponseModel | null>();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { jobName } = useContext(JobNameContext);

    useEffect(() => {
        (async () => getFeatures())();
        MenuComponent.reinitialization();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobName]);

    const resetDataHandle = () => {
        setSearchTerm("");
        setSelectedFeature(null);
        updateState({ filter: { featureId: null }, search: "", ...initialQueryState });
    };

    const filterDataHandle = () => {
        updateState({ filter: { featureId: selectedFeature?.id }, search: searchTerm, ...initialQueryState });
    };

    const getFeatures = async () => {
        const request: RequestData<FeatureResponseModel[]> = {
            successCallback: (response: FeatureResponseModel[]) => {
                setFeatures(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await cucumberService.getInstance().getFeatures(request, { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly }, jobName);
    };

    return (
        <>
            {/* begin::Filter Button */}
            <button
                disabled={isLoading}
                type="button"
                className="btn btn-light-primary me-3"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
            >
                <Icon iconName="filter" className="fs-2" />
                Filter
            </button>
            {/* end::Filter Button */}
            {/* begin::SubMenu */}
            <div className="menu menu-sub menu-sub-dropdown w-300px w-md-475px " data-kt-menu="true">
                {/* begin::Header */}
                <div className="px-7 py-5">
                    <div className="fs-5 text-dark fw-bolder">
                        <FormattedMessage id="Filter Options" />
                    </div>
                </div>
                {/* end::Header */}

                {/* begin::Separator */}
                <div className="separator border-gray-200"></div>
                {/* end::Separator */}

                {/* begin::Content */}
                <div className="px-7 py-5" data-kt-user-table-filter="form">
                    {/* begin::Input group */}
                    <div className="mb-10">
                        <div className="d-flex align-items-center position-relative my-1">
                            <i className="bi bi-search position-absolute ms-6"></i>
                            <input
                                type="text"
                                data-kt-user-table-filter="search"
                                className="form-control form-control-solid w-full ps-14"
                                placeholder={intl.formatMessage({ id: "Search feature or test case" })}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* end::Input group */}

                    {/* begin::Input group */}
                    <div className="mb-10">
                        <label className="form-label fs-6 fw-bold">
                            <FormattedMessage id="Features" />:
                        </label>
                        <Select
                            value={selectedFeature}
                            onChange={setSelectedFeature}
                            options={features}
                            isSearchable
                            isClearable
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id.toString()}
                        />
                    </div>
                    {/* end::Input group */}

                    {/* begin::Actions */}
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={resetDataHandle}
                            className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                            data-kt-menu-dismiss="true"
                            data-kt-user-table-filter="reset"
                        >
                            <FormattedMessage id="Reset" />
                        </button>
                        <button
                            disabled={isLoading}
                            type="button"
                            onClick={filterDataHandle}
                            className="btn btn-primary fw-bold px-6"
                            data-kt-menu-dismiss="true"
                            data-kt-user-table-filter="filter"
                        >
                            <FormattedMessage id="Apply" />
                        </button>
                    </div>
                    {/* end::Actions */}
                </div>
                {/* end::Content */}
            </div>
            {/* end::SubMenu */}
        </>
    );
};

export { TestCaseTableFilter };
