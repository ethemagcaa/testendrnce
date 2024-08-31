import React, { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { queryClient } from "@react-query/queryClient";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { healthCheckService } from "@services/HealthCheckService";
import { RequestData } from "@library/HttpClient";
import { EndpointRequestModel } from "@services/model/payload/request/health-check/EndpointRequestModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { adminRoutes, generateDynamicPath } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { useThemeMode } from "@modules/admin/layout/context/theme-mode-context";
import { EndpointResponseModel } from "@services/model/payload/response/health-check/EndpointResponseModel";

const EndpointForm: FC = () => {
    const intl = useIntl();
    const { mode } = useThemeMode();
    const navigate = useNavigate();
    const { vendorId, endpointId } = useParams<{ vendorId: string, endpointId: string }>();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<EndpointRequestModel>({
        name: "",
        path: "",
        requestType: "",
        requestPayload: "",
        requestHeader: "",
        status: true
    });

    useEffect(() => {
        const fetchEndpoint = async () => {
            if (endpointId) {
                const response = await healthCheckService.getInstance().getEndpointById(endpointId);
                response.requestPayload ||= "";
                response.period ||= undefined;

                setInitialValues(response);
            }
        };

        (async () => await fetchEndpoint())();
    }, [endpointId]);

    const endpointSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(250, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 250 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Name" }) })),
        path: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Path" }) })),
        requestType: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Request Type" }) })),
        status: Yup.boolean()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Status" }) }))
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: endpointSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<EndpointRequestModel> = {
                successCallback: (response: EndpointResponseModel) => {
                    setLoading(false);
                    toast.success(`${response.name} ${intl.formatMessage({ id: "is created" })}`);

                    queryClient.clear();

                    openEndpointListPage();
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    id: endpointId ? Number(endpointId) : undefined,
                    healthCheckVendorId: Number(vendorId),
                    name: values.name,
                    period: values.period,
                    path: values.path,
                    requestType: values.requestType,
                    requestPayload: values.requestPayload,
                    requestHeader: values.requestHeader,
                    status: values.status,
                }
            };

            if (endpointId)
                await healthCheckService.getInstance().updateEndpoint(submitRequest);
            else
                await healthCheckService.getInstance().createEndpoint(submitRequest);
        },
    });

    const openEndpointListPage = () => {
        const route = generateDynamicPath(adminRoutes.healthCheck.child.vendor.child.endpoint, { vendorId });
        navigate(route);
    };

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
            title: intl.formatMessage({ id: "Vendor Management" }),
            path: adminRoutes.healthCheck.child.vendor.route,
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

    const onChangeRequestHeader = React.useCallback((val: string) => {
        formik.setFieldValue("requestHeader", val);
    }, [formik]);

    const onChangeRequestPayload = React.useCallback((val: string) => {
        formik.setFieldValue("requestPayload", val);
    }, [formik]);

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: "Add Endpoint" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="endpoint_form"
            >
                <div
                    className="d-flex flex-column scroll-y px-5 px-lg-10"
                >
                    <div className="fv-row mb-7">
                        <label htmlFor="name" className="required fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Name" })}
                        </label>
                        <input
                            type="text"
                            placeholder={intl.formatMessage({ id: "Name" })}
                            autoComplete="off"
                            {...formik.getFieldProps("name")}
                            className={clsx(
                                "form-control form-control-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.name && formik.errors.name },
                                { "is-valid": formik.touched.name && !formik.errors.name }
                            )}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label htmlFor="path" className="required fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Path" })}
                        </label>
                        <input
                            type="text"
                            placeholder={intl.formatMessage({ id: "Path" })}
                            autoComplete="off"
                            {...formik.getFieldProps("path")}
                            className={clsx(
                                "form-control form-control-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.path && formik.errors.path },
                                { "is-valid": formik.touched.path && !formik.errors.path }
                            )}
                        />
                        {formik.touched.path && formik.errors.path && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.path}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label htmlFor="requestType" className="required fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Request Type" })}
                        </label>
                        <select
                            id="requestType"
                            {...formik.getFieldProps("requestType")}
                            className={clsx(
                                "form-select form-select-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.requestType && formik.errors.requestType },
                                { "is-valid": formik.touched.requestType && !formik.errors.requestType }
                            )}
                        >
                            <option value="" label={intl.formatMessage({ id: "Select Request Type" })} />
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>
                        {formik.touched.requestType && formik.errors.requestType && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.requestType}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label htmlFor="requestHeader" className="fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Request Header" })}
                        </label>
                        <CodeMirror
                            id={"requestHeader"}
                            height="200px"
                            extensions={[json()]}
                            theme={mode === "system" ? "none" : mode}
                            {...formik.getFieldProps("requestHeader")}
                            onChange={onChangeRequestHeader}
                            className={clsx(
                                { "is-invalid": formik.touched.requestHeader && formik.errors.requestHeader },
                                { "is-valid": formik.touched.requestHeader && !formik.errors.requestHeader }
                            )}
                        />
                        {formik.touched.requestHeader && formik.errors.requestHeader && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.requestHeader}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label htmlFor="requestPayload" className="fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Request Payload" })}
                        </label>
                        <CodeMirror
                            id={"requestPayload"}
                            height="200px"
                            extensions={[json()]}
                            theme={mode === "system" ? "none" : mode}
                            {...formik.getFieldProps("requestPayload")}
                            onChange={onChangeRequestPayload}
                            className={clsx(
                                { "is-invalid": formik.touched.requestPayload && formik.errors.requestPayload },
                                { "is-valid": formik.touched.requestPayload && !formik.errors.requestPayload }
                            )}
                        />
                        {formik.touched.requestPayload && formik.errors.requestPayload && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.requestPayload}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label
                            htmlFor="period"
                            className="fw-semibold fs-6 mb-2"
                        >
                            {intl.formatMessage({ id: "Period" })}
                        </label>
                        <input
                            type="number"
                            placeholder={intl.formatMessage({ id: "Period" })}
                            autoComplete="off"
                            {...formik.getFieldProps("period")}
                            className={clsx(
                                "form-control form-control-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.period && formik.errors.period },
                                { "is-valid": formik.touched.period && !formik.errors.period },
                            )}
                        />
                        {formik.touched.period && formik.errors.period && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.period}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-check form-switch form-check-custom form-check-solid">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            {...formik.getFieldProps("status")}
                            id="status"
                            checked={formik.values.status}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="status"
                        >
                            {formik.values.status
                                ? intl.formatMessage({ id: "Enable" })
                                : intl.formatMessage({ id: "Disable" })}
                        </label>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <Button
                        baseColor={"light"}
                        activeLight={"primary"}
                        className={"me-3"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        onClick={openEndpointListPage}
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

export { EndpointForm };
