import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { adminRoutes } from "@/constants/routeConstants";

const ForgotPassword: FC = () => {
    const intl = useIntl();

    const [loading, setLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
    const setDeleted = useState("")[1];

    // #region Form Handler

    const forgotPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email(intl.formatMessage({ id: "Wrong email format." }))
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, {
                count: 3,
            }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, {
                count: 50,
            }))
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "Email" }),
            })),
    });

    const initialValues = {
        email: "",
    };

    const formik = useFormik({
        initialValues,
        validationSchema: forgotPasswordSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setHasErrors(undefined);

            setDeleted(values.email);
            setStatus(false);
            setSubmitting(false);

            // setTimeout(() => {
            //     requestPassword(values.email)
            //         .then(({data: {result}}) => {
            //             setHasErrors(false)
            //             setLoading(false)
            //         })
            //         .catch(() => {
            //             setHasErrors(true)
            //             setLoading(false)
            //             setSubmitting(false)
            //             setStatus('The login detail is incorrect')
            //         })
            // }, 1000)
        },
    });

    // #endregion

    return (
        <form
            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            noValidate
            id="password_reset_form"
            onSubmit={formik.handleSubmit}
        >
            <div className="text-center mb-10">
                {/* begin::Title */}
                <h1 className="text-dark mb-3">
                    <FormattedMessage id="Forgot Password ?" />
                </h1>
                {/* end::Title */}

                {/* begin::Link */}
                <div className="text-gray-400 fw-bold fs-4">
                    <FormattedMessage id="Enter your email to reset your password" />
                </div>
                {/* end::Link */}
            </div>

            {/* begin::Title */}
            {hasErrors === true && (
                <div className="mb-lg-15 alert alert-danger">
                    <div className="alert-text font-weight-bold">
                        <FormattedMessage id="Sorry, looks like there are some errors detected, please try again." />
                    </div>
                </div>
            )}

            {hasErrors === false && (
                <div className="mb-10 bg-light-info p-8 rounded">
                    <div className="text-info">
                        <FormattedMessage id="Sent password reset. Please check your email." />
                    </div>
                </div>
            )}
            {/* end::Title */}

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <label htmlFor="email" className="form-label fw-bolder text-gray-900 fs-6">
                    <FormattedMessage id="Email" />
                </label>
                <input
                    type="email"
                    aria-label={"email"}
                    placeholder={intl.formatMessage({ id: "Email" })}
                    autoComplete="off"
                    {...formik.getFieldProps("email")}
                    className={clsx(
                        "form-control form-control-lg",
                        { "is-invalid": formik.touched.email && formik.errors.email },
                        { "is-valid": formik.touched.email && !formik.errors.email },
                    )}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                            <span role="alert">{formik.errors.email}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="d-flex flex-wrap justify-content-center pb-lg-0">
                <button
                    type="submit"
                    id="password_reset_submit"
                    className="btn btn-lg btn-primary fw-bolder me-4"
                >
                    <span className="indicator-label">
                        <FormattedMessage id="Submit" />
                    </span>
                    {loading && (
                        <span className="indicator-progress">
                            <FormattedMessage id="Please wait..." />
                            <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                    )}
                </button>
                <Link to={adminRoutes.login}>
                    <button
                        type="button"
                        id="login_password_reset_form_cancel_button"
                        className="btn btn-lg btn-light-primary fw-bolder"
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        <FormattedMessage id="Cancel" />
                    </button>
                </Link>
                {" "}
            </div>
            {/* end::Form group */}
        </form>
    );
};

export default ForgotPassword;
