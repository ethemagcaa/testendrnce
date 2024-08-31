import React, { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { queryClient } from "@react-query/queryClient";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { AxiosError } from "axios";

import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { healthCheckService } from "@services/HealthCheckService";
import { RequestData } from "@library/HttpClient";
import { EnvironmenRequestModel } from "@services/model/payload/request/health-check/EnvironmenRequestModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { VendorResponseModel } from "@services/model/payload/response/health-check/VendorResponseModel";
import { VendorRequestModel } from "@services/model/payload/request/health-check/VendorRequestModel";

const EnvironmentForm: FC = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [selectedVendor, setSelectedVendor] = useState<VendorResponseModel | null>();
    const { environmentId } = useParams<{ environmentId: string }>();
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState<VendorResponseModel[]>([]);
    const [initialValues, setInitialValues] = useState<EnvironmenRequestModel>({
        environmentKey: "",
        environmentValue: ""
    });

    useEffect(() => {
        (async () => getVendors())();
    }, [environmentId]);

    useEffect(() => {
        (async () => await fetchEnvironment())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vendors]);

    const getVendors = async () => {
        const request: RequestData<VendorRequestModel[]> = {
            successCallback: (response: VendorResponseModel[]) => {
                setVendors(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await healthCheckService.getInstance().getVendor(request);
    };

    const fetchEnvironment = async () => {
        if (environmentId) {
            const response = await healthCheckService.getInstance().getEnvironmentById(environmentId);
            setInitialValues(response);
            setSelectedVendor(vendors.find(env => env.id === response?.healthCheckVendorId));
        }
    };

    const validationSchema = Yup.object().shape({
        healthCheckVendorId: Yup.number()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Vendor Name" }) })),
        environmentKey: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(250, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Key" }) })),
        environmentValue: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(250, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Value" }) })),
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<EnvironmenRequestModel> = {
                successCallback: (response: EnvironmenRequestModel) => {
                    setLoading(false);

                    toast.success(`${response.environmentKey} ${intl.formatMessage({ id:  environmentId ? "is updated" : "is created" })}`);

                    queryClient.clear();

                    navigate(adminRoutes.healthCheck.child.environment);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    id: environmentId ? Number(environmentId) : undefined,
                    healthCheckVendorId: selectedVendor?.id,
                    environmentKey: values.environmentKey,
                    environmentValue: values.environmentValue,
                },
            };

            if (environmentId)
                await healthCheckService.getInstance().updateEnvironment(submitRequest);
            else
                await healthCheckService.getInstance().createEnvironment(submitRequest);

        },
    });

    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Health Check" }),
            path: adminRoutes.healthCheck.route,
            isSeparator: false,
            isActive: false,
        },
        {
            title: "",
            path: "",
            isSeparator: true,
            isActive: false,
        },
        {
            title: intl.formatMessage({ id: "Environment Management" }),
            path: adminRoutes.healthCheck.child.environment,
            isSeparator: false,
            isActive: false,
        },
        {
            title: "",
            path: "",
            isSeparator: true,
            isActive: false,
        },
    ];

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: environmentId ? "Edit Environment" : "Add Environment" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="environment_form"
            >
                <div className="fv-row mb-7">
                    <label
                        htmlFor="healthCheckVendorId"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        <FormattedMessage id="Vendor Name" />:
                    </label>
                    <Select
                        {...formik.getFieldProps("healthCheckVendorId")}
                        value={selectedVendor}
                        onChange={(selectedVendor) => {
                            setSelectedVendor(selectedVendor);
                            formik.values.healthCheckVendorId = selectedVendor?.id;
                        }}
                        options={vendors}
                        isSearchable
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id.toString()}
                        className={clsx(
                            "form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.healthCheckVendorId && formik.errors.healthCheckVendorId },
                            { "is-valid": formik.touched.healthCheckVendorId && !formik.errors.healthCheckVendorId },
                        )}
                    />
                    {formik.touched.healthCheckVendorId && formik.errors.healthCheckVendorId && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.healthCheckVendorId}</span>
                        </div>
                    )}
                </div>

                <div className="fv-row mb-7">
                    <label
                        htmlFor="environmentKey"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        {intl.formatMessage({ id: "Key" })}
                    </label>
                    <input
                        type="text"
                        placeholder={intl.formatMessage({ id: "Key" })}
                        {...formik.getFieldProps("environmentKey")}
                        className={clsx(
                            "form-control form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.environmentKey && formik.errors.environmentKey },
                            { "is-valid": formik.touched.environmentKey && !formik.errors.environmentKey },
                        )}
                    />
                    {formik.touched.environmentKey && formik.errors.environmentKey && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.environmentKey}</span>
                        </div>
                    )}
                </div>

                <div className="fv-row mb-7">
                    <label htmlFor="url" className="required fw-semibold fs-6 mb-2">
                        {intl.formatMessage({ id: "Value" })}
                    </label>
                    <input
                        type="text"
                        placeholder= {intl.formatMessage({ id: "Value" })}
                        autoComplete="off"
                        {...formik.getFieldProps("environmentValue")}
                        className={clsx(
                            "form-control form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.environmentValue && formik.errors.environmentValue },
                            { "is-valid": formik.touched.environmentValue && !formik.errors.environmentValue },
                        )}
                    />
                    {formik.touched.environmentValue && formik.errors.environmentValue && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.environmentValue}</span>
                        </div>
                    )}
                </div>

                <div className="text-center pt-15">
                    <Button
                        baseColor={"light"}
                        activeLight={"primary"}
                        className={"me-3"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        onClick={() => navigate(adminRoutes.healthCheck.child.environment)}
                    >
                        <FormattedMessage id="Discard" />
                    </Button>
                    <Button
                        baseColor={"primary"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        type={"submit"}
                    >
                        {!loading
                            && (
                                <span className="indicator-label">
                                    <FormattedMessage id="Submit" />
                                </span>
                            )}
                        {loading && (
                            <span className="indicator-progress" style={{ display: "block" }}>
                                <FormattedMessage id="Please wait..." />
                                <span className="spinner-border spinner-border-sm align-middle ms-2" />
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};

export { EnvironmentForm };
