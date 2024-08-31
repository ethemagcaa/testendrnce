import React, { FC, useContext, useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import jwtDecode from "jwt-decode";
import { AxiosError } from "axios";

import useAsset from "@hooks/use-asset";
import { AUTHTYPE } from "@modules/admin/auth/enum/AuthType";
import { AuthContext } from "@modules/admin/auth/context/auth-context";
import { authService } from "@services/AuthService";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@/constants";
import { TokenModel } from "@modules/admin/auth/model/TokenModel";
import { RequestData } from "@library/HttpClient";
import { adminRoutes } from "@/constants/routeConstants";

const Login: FC = () => {
    const authContext = useContext(AuthContext);
    const toAbsoluteUrl = useAsset();
    const intl = useIntl();
    const [searchParams] = useSearchParams();
    let errParam = searchParams.get("err");

    if(errParam === "401")
        errParam = intl.formatMessage({ id: "You are not authorized to access" });
    else if (errParam === "403")
        errParam = intl.formatMessage({ id: "User hasn't enough permission" });
    else if (errParam === "404")
        errParam = intl.formatMessage({ id: "User is not found" });

    const [loading, setLoading] = useState(false);

    // #region Form Handler

    const loginSchema = Yup.object().shape({
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
            // .min(8, intl.formatMessage({ id: "Minimum {count} symbols" }, {
            //     count: 8,
            // }))
            // .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, {
            //     count: 50,
            // }))
            .required(intl.formatMessage({ id: "{name} required field." }, {
                name: intl.formatMessage({ id: "Password" }),
            })),
    });

    const initialValues = {
        email: "",
        password: "",
    };

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const loginRequest: RequestData<object> = {
                successCallback: (response: string) => {
                    setLoading(false);
                    const token: TokenModel = jwtDecode(response);

                    authContext.login({
                        token: response,
                        expirationTime: token.exp,
                        authType: AUTHTYPE.ONSITE,
                    });
                },
                errorCallback: (error: AxiosError) => {
                    setLoading(false);
                    setSubmitting(false);

                    if (error && error.status === 401)
                        setStatus(intl.formatMessage({ id: "Entered your e-mail or password incorrectly." }));
                    else
                        setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    email: values.email,
                    password: values.password,
                },
            };
            await authService.getInstance().login(loginRequest);
        },
    });

    // #endregion

    return (
        <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
            id="signing_form"
        >
            {/* begin::Heading */}
            <div className="text-center mb-10">
                <h1 className="text-dark mb-3">
                    <FormattedMessage id="Sign in" />
                </h1>
                <div className="text-gray-400 fw-bold fs-4">
                    <FormattedMessage id="New here?" />
                    {" "}
                    <Link to={adminRoutes.registration} className="link-primary fw-bolder">
                        <FormattedMessage id="Create an Account" />
                    </Link>
                </div>
            </div>
            {/* begin::Heading */}

            {formik.status && (
                <div className="mb-lg-15 alert alert-danger">
                    <div className="alert-text font-weight-bold">{formik.status}</div>
                </div>
            )}
            {errParam && (
                <div className="mb-lg-15 alert alert-warning">
                    <div className="alert-text font-weight-bold">{<FormattedMessage id={errParam} />}</div>
                </div>
            )}

            <Outlet />

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <label
                    htmlFor="email"
                    className="form-label fs-6 fw-bolder text-dark"
                >
                    <FormattedMessage id="Email" />
                </label>
                <input
                    placeholder={intl.formatMessage({ id: "Email" })}
                    {...formik.getFieldProps("email")}
                    className={clsx(
                        "form-control bg-transparent",
                        { "is-invalid": formik.touched.email && formik.errors.email },
                        { "is-valid": formik.touched.email && !formik.errors.email },
                    )}
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.email}</span>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <div className="d-flex justify-content-between mt-n5">
                    <div className="d-flex flex-stack mb-2">
                        <label
                            htmlFor="password"
                            className="form-label fw-bolder text-dark fs-6 mb-0"
                        >
                            <FormattedMessage id="Password" />
                        </label>

                        <Link
                            to={adminRoutes.forgotPassword}
                            className="link-primary fs-6 fw-bolder"
                            style={{ marginLeft: "5px" }}
                        >
                            <FormattedMessage id="Forgot Password ?" />
                        </Link>
                    </div>
                </div>
                <input
                    id="password"
                    type="password"
                    autoComplete="off"
                    {...formik.getFieldProps("password")}
                    className={clsx(
                        "form-control bg-transparent",
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
            {/* end::Form group */}

            {/* begin::Action */}
            <div className="text-center">
                <button
                    type="submit"
                    id="kt_sign_in_submit"
                    className="btn btn-lg btn-primary w-100 mb-5"
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    {!loading
                    && (
                        <span className="indicator-label">
                            <FormattedMessage id="Sign in" />
                        </span>
                    )}
                    {loading && (
                        <span className="indicator-progress" style={{ display: "block" }}>
                            <FormattedMessage id="Please wait..." />
                            <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                    )}
                </button>

                {/* begin::Separator */}
                <div className="d-flex align-items-center mb-10">
                    <div className="border-bottom border-gray-300 mw-50 w-100" />
                    <span className="fw-bold text-gray-400 fs-7 mx-2">
                        <FormattedMessage id="Or" />
                    </span>
                    <div className="border-bottom border-gray-300 mw-50 w-100" />
                </div>
                {/* end::Separator */}

                {/* begin::Google link */}
                <a href={GOOGLE_AUTH_URL} className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5">
                    <img
                        alt="Google"
                        src={toAbsoluteUrl("/media/svg/brand-logos/google.svg")}
                        className="h-20px me-3"
                    />
                    <FormattedMessage id="Continue with {name}" values={{ name: "Google" }} />
                </a>
                {/* end::Google link */}

                {/* begin::Github link */}
                <a href={GITHUB_AUTH_URL} className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5">
                    <img
                        alt="Github"
                        src={toAbsoluteUrl("/media/svg/brand-logos/github.svg")}
                        className="h-20px me-3"
                    />
                    <FormattedMessage id="Continue with {name}" values={{ name: "Github" }} />
                </a>
                {/* end::Github link */}
            </div>
            {/* end::Action */}
        </form>
    );
};

export default Login;
