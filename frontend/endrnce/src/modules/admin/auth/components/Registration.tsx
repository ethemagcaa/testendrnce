/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import clsx from "clsx";
import { useFormik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";

import useAsset from "@hooks/use-asset";
import { PasswordMeterComponent } from "@assets/ts/components";
import { RequestData } from "@library/HttpClient";
import { TokenModel } from "@modules/admin/auth/model/TokenModel";
import jwtDecode from "jwt-decode";
import { AUTHTYPE } from "@modules/admin/auth/enum/AuthType";
import { AxiosError } from "axios";
import { authService } from "@services/AuthService";
import { AuthContext } from "@modules/admin/auth/context/auth-context";
import { RegisterRequestModel } from "@modules/admin/auth/model/payload/request/RegisterRequestModel";
import { adminRoutes } from "@/constants/routeConstants";

const Registration: FC = () => {
    const authContext = useContext(AuthContext);
    const toAbsoluteUrl = useAsset();
    const intl = useIntl();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        PasswordMeterComponent.bootstrap();
    }, []);

    // #region Form Handler

    const registrationSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, {
                count: 3,
            }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, {
                count: 50,
            }))
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "First Name" }),
            })),
        lastName: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, {
                count: 3,
            }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, {
                count: 50,
            }))
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "Last Name" }),
            })),
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
        password: Yup.string()
            .min(8, intl.formatMessage({ id: "Minimum {count} symbols" }, {
                count: 8,
            }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, {
                count: 50,
            }))
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "Password" }),
            })),
        confirmPassword: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "Confirm Password" }),
            }))
            .oneOf([Yup.ref("password")], intl.formatMessage({ id: "Password and Confirm Password didn't match" })),
        acceptTerms: Yup.bool().required(intl.formatMessage({ id: "You must accept the terms and conditions." })),
    });

    const initialValues: RegisterRequestModel = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    };

    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);

            setStatus(false);
            setSubmitting(false);

            const registerRequest: RequestData<RegisterRequestModel> = {
                successCallback: (response: string) => {
                    const token: TokenModel = jwtDecode(response);

                    authContext.login({
                        token: response,
                        expirationTime: token.exp,
                        authType: AUTHTYPE.ONSITE,
                    });
                },
                errorCallback: (error: AxiosError) => {
                    setSubmitting(false);

                    if (error && error.status === 409)
                        setStatus(intl.formatMessage({ id: "Entered email address is in used." }));
                    else
                        setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                finallyCallback: () => {
                    setLoading(false);
                },
                data: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                },
            };
            await authService.getInstance().register(registerRequest);
        },
    });

    // #endregion

    return (
        <form
            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            noValidate
            id="signup"
            onSubmit={formik.handleSubmit}
        >
            {/* begin::Heading */}
            <div className="mb-10 text-center">
                {/* begin::Title */}
                <h1 className="text-dark mb-3">
                    <FormattedMessage id="Create an Account" />
                </h1>
                {/* end::Title */}

                {/* begin::Link */}
                <div className="text-gray-400 fw-bold fs-4">
                    <FormattedMessage id="Already have an account?" />
                    <Link to={adminRoutes.login} className="link-primary fw-bolder" style={{ marginLeft: "5px" }}>
                        <FormattedMessage id="Sign in" />
                    </Link>
                </div>
                {/* end::Link */}
            </div>
            {/* end::Heading */}

            {/* begin::Action */}
            <button type="button" className="btn btn-light-primary fw-bolder w-100 mb-10">
                <img
                    alt="Google"
                    src={toAbsoluteUrl("/media/svg/brand-logos/google.svg")}
                    className="h-20px me-3"
                />
                {intl.formatMessage({ id: "Continue with {name}" }, { name: "Google" })}
            </button>
            {/* end::Action */}

            <div className="d-flex align-items-center mb-10">
                <div className="border-bottom border-gray-300 mw-50 w-100" />
                <span className="fw-bold text-gray-400 fs-7 mx-2">
                    <FormattedMessage id="Or" />
                </span>
                <div className="border-bottom border-gray-300 mw-50 w-100" />
            </div>

            {formik.status && (
                <div className="mb-lg-15 alert alert-danger">
                    <div className="alert-text font-weight-bold">{formik.status}</div>
                </div>
            )}

            {/* begin::Form group Firstname */}
            <div className="row fv-row mb-7">
                <div className="col-xl-6">
                    <div className="fv-row mb-5">
                        <label
                            htmlFor="firstname"
                            className="form-label fw-bolder text-dark fs-6"
                        >
                            <FormattedMessage id="First Name" />
                        </label>
                        <input
                            id="firstname"
                            placeholder={intl.formatMessage({ id: "First Name" })}
                            type="text"
                            autoComplete="off"
                            {...formik.getFieldProps("firstName")}
                            className={clsx(
                                "form-control form-control-lg",
                                { "is-invalid": formik.touched.firstName && formik.errors.firstName },
                                { "is-valid": formik.touched.firstName && !formik.errors.firstName },
                            )}
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <span role="alert">{formik.errors.firstName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-xl-6">
                    {/* begin::Form group Lastname */}
                    <div className="fv-row mb-5">
                        <label
                            htmlFor="lastname"
                            className="form-label fw-bolder text-dark fs-6"
                        >
                            <FormattedMessage id="Last Name" />
                        </label>
                        <input
                            id="lastname"
                            placeholder={intl.formatMessage({ id: "Last Name" })}
                            type="text"
                            autoComplete="off"
                            {...formik.getFieldProps("lastName")}
                            className={clsx(
                                "form-control form-control-lg",
                                { "is-invalid": formik.touched.lastName && formik.errors.lastName },
                                { "is-valid": formik.touched.lastName && !formik.errors.lastName },
                            )}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <span role="alert">{formik.errors.lastName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* end::Form group */}
                </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group Email */}
            <div className="fv-row mb-7">
                <label
                    htmlFor="email"
                    className="form-label fw-bolder text-dark fs-6"
                >
                    <FormattedMessage id="Email" />
                </label>
                <input
                    id="email"
                    placeholder={intl.formatMessage({ id: "Email" })}
                    type="email"
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

            {/* begin::Form group Password */}
            <div className="mb-10 fv-row" data-kt-password-meter="true">
                <div className="mb-1">
                    <label
                        htmlFor="password"
                        className="form-label fw-bolder text-dark fs-6"
                    >
                        <FormattedMessage id="Password" />
                    </label>
                    <div className="position-relative mb-3">
                        <input
                            id="password"
                            type="password"
                            placeholder={intl.formatMessage({ id: "Password" })}
                            autoComplete="off"
                            {...formik.getFieldProps("password")}
                            className={clsx(
                                "form-control form-control-lg",
                                { "is-invalid": formik.touched.password && formik.errors.password },
                                { "is-valid": formik.touched.password && !formik.errors.password },
                            )}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <span role="alert">{formik.errors.password}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* begin::Meter */}
                    <div
                        className="d-flex align-items-center mb-3"
                        data-kt-password-meter-control="highlight"
                    >
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px" />
                    </div>
                    {/* end::Meter */}
                </div>
                <div className="text-muted">
                    <FormattedMessage id="Use 8 or more characters with a mix of letters, numbers & symbols." />
                </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group Confirm password */}
            <div className="fv-row mb-5">
                <label
                    htmlFor="confirmPassword"
                    className="form-label fw-bolder text-dark fs-6"
                >
                    <FormattedMessage id="Confirm Password" />
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder={intl.formatMessage({ id: "Confirm Password" })}
                    autoComplete="off"
                    {...formik.getFieldProps("confirmPassword")}
                    className={clsx(
                        "form-control form-control-lg",
                        {
                            "is-invalid": formik.touched.confirmPassword && formik.errors.confirmPassword,
                        },
                        {
                            "is-valid": formik.touched.confirmPassword && !formik.errors.confirmPassword,
                        },
                    )}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                            <span role="alert">{formik.errors.confirmPassword}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <div className="form-check form-check-custom">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="toc_agree"
                        {...formik.getFieldProps("acceptTerms")}
                    />
                    <label
                        className="form-check-label fw-bold text-gray-700 fs-6"
                        htmlFor="toc_agree"
                    >
                        <FormattedMessage
                            id="I Agree the <a>terms and conditions</a>."
                            values={{
                                a: (chunks: any) => (<Link to={adminRoutes.terms} className="ms-1 link-primary">{chunks}</Link>),
                            }}
                        />
                    </label>
                    {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                                <span role="alert">{formik.errors.acceptTerms}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="text-center">
                <button
                    type="submit"
                    id="kt_sign_up_submit"
                    className="btn btn-lg btn-primary w-100 mb-5"
                    disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
                >
                    {!loading && (
                        <span className="indicator-label">
                            <FormattedMessage id="Submit" />
                        </span>
                    )}
                    {loading && (
                        <span className="indicator-progress" style={{ display: "block" }}>
                            <FormattedMessage id="Please wait..." />
                            {" "}
                            <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                    )}
                </button>
                <Link to={adminRoutes.login}>
                    <button
                        type="button"
                        id="kt_login_signup_form_cancel_button"
                        className="btn btn-lg btn-light-primary w-100 mb-5"
                    >
                        <FormattedMessage id="Cancel" />
                    </button>
                </Link>
            </div>
            {/* end::Form group */}
        </form>
    );
};

export default Registration;
