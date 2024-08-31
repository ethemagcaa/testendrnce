import React, { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { queryClient } from "@react-query/queryClient";
import { useNavigate, useParams } from "react-router-dom";

import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { healthCheckService } from "@services/HealthCheckService";
import { RequestData } from "@library/HttpClient";
import { VendorRequestModel } from "@services/model/payload/request/health-check/VendorRequestModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";

const VendorForm: FC = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { vendorId } = useParams<{ vendorId: string }>();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<VendorRequestModel>({
        name: "",
        url: "",
        period: 60000,
        status: true,
    });

    useEffect(() => {
        const fetchVendor = async () => {
            if (vendorId) {
                const response = await healthCheckService.getInstance().getVendorById(vendorId);
                setInitialValues(response);
            }
        };

        (async () => await fetchVendor())();
    }, [vendorId]);

    const vendorSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Name" }) })),
        url: Yup.string()
            .url(intl.formatMessage({ id: "Invalid Url format." }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Url" }) })),
        period: Yup.number()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Period" }) })),
        status: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Status" }) }))
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: vendorSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<VendorRequestModel> = {
                successCallback: (response: VendorRequestModel) => {
                    setLoading(false);

                    toast.success(`${response.name} ${intl.formatMessage({ id:  vendorId ? "is updated" : "is created" })}`);

                    queryClient.clear();

                    navigate(adminRoutes.healthCheck.child.vendor.route);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    id: vendorId ? Number(vendorId) : undefined,
                    name: values.name,
                    url: values.url,
                    period: values.period,
                    status: values.status,
                },
            };

            if (vendorId)
                await healthCheckService.getInstance().updateVendor(submitRequest);
            else
                await healthCheckService.getInstance().createVendor(submitRequest);

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

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: vendorId ? "Edit Vendor" : "Add Vendor" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="vendor_form"
            >
                <div
                    className="d-flex flex-column scroll-y px-5 px-lg-10"
                    id="kt_modal_add_user_scroll"
                    data-kt-scroll="true"
                    data-kt-scroll-activate="true"
                    data-kt-scroll-max-height="auto"
                    data-kt-scroll-dependencies="#kt_modal_add_user_header"
                    data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                    data-kt-scroll-offset="300px"
                >

                    <div className="fv-row mb-7">
                        <label
                            htmlFor="name"
                            className="required fw-semibold fs-6 mb-2"
                        >
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
                                { "is-valid": formik.touched.name && !formik.errors.name },
                            )}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label htmlFor="url" className="required fw-semibold fs-6 mb-2">
                            {intl.formatMessage({ id: "Url" })}
                        </label>
                        <input
                            type="text"
                            placeholder="https://url.com"
                            autoComplete="off"
                            {...formik.getFieldProps("url")}
                            className={clsx(
                                "form-control form-control-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.url && formik.errors.url },
                                { "is-valid": formik.touched.url && !formik.errors.url },
                            )}
                        />
                        {formik.touched.url && formik.errors.url && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.url}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
                        <label
                            htmlFor="period"
                            className="required fw-semibold fs-6 mb-2"
                        >
                            {intl.formatMessage({ id: "Period" })} (ms)
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

                    <div className="fv-row mb-7">
                        <label
                            htmlFor="status"
                            className="required fw-semibold fs-6 mb-2"
                        >
                            {intl.formatMessage({ id: "Status" })}
                        </label>
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
                        {formik.touched.status && formik.errors.status && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.status}</span>
                            </div>
                        )}
                    </div>

                </div>

                <div className="text-center pt-15">
                    <Button
                        baseColor={"light"}
                        activeLight={"primary"}
                        className={"me-3"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        onClick={() => navigate(adminRoutes.healthCheck.child.vendor.route)}
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

export { VendorForm };
