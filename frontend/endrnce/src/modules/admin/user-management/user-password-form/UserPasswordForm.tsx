import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { userService } from "@services/UserService";
import { RequestData } from "@library/HttpClient";
import { UserResponseModel } from "@services/model/payload/response/user/UserResponseModel";
import { queryClient } from "@react-query/queryClient";
import { UsePasswordModel } from "@services/model/payload/request/user/UserPasswordRequestModel";

const UserPasswordForm: FC = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [loading, setLoading] = useState(false);

    const passwordSchema = Yup.object().shape({
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
            .oneOf([Yup.ref("password")], intl.formatMessage({ id: "Password and Confirm Password didn't match" }))
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validationSchema: passwordSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<UsePasswordModel> = {
                successCallback: (response: UserResponseModel) => {
                    setLoading(false);

                    toast.success(intl.formatMessage({ id: `Password of ${response.firstName} changed successfully!` }));

                    queryClient.clear();

                    navigate(adminRoutes.users.child.user);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    id: Number(userId),
                    password: values.password
                }
            };

            await userService.getInstance().updateUserPassword(submitRequest);
        },
    });

    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "Change Password" }),
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
            title: intl.formatMessage({ id: "User Management" }),
            path: adminRoutes.users.child.passwordForm,
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
                {intl.formatMessage({ id: "Change Password" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="password_form"
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
                            htmlFor="password"
                            className="required fw-semibold fs-6 mb-2"
                        >
                            {intl.formatMessage({ id: "Password" })}
                        </label>
                        <input
                            type="password"
                            placeholder={intl.formatMessage({ id: "Password" })}
                            autoComplete="off"
                            {...formik.getFieldProps("password")}
                            className={clsx(
                                "form-control form-control-solid mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.password && formik.errors.password },
                                { "is-valid": formik.touched.password && !formik.errors.password },
                            )}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="fv-plugins-message-container">
                                <span role="alert">{formik.errors.password}</span>
                            </div>
                        )}
                    </div>

                    <div className="fv-row mb-7">
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
                                "form-control form-control-solid mb-3 mb-lg-0",
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
                    <div
                        className="d-flex align-items-center mb-3"
                        data-kt-password-meter-control="highlight"
                    >
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                        <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px" />
                    </div>
                </div>

                <div className="text-center pt-15">
                    <Button
                        baseColor={"light"}
                        activeLight={"primary"}
                        className={"me-3"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        onClick={() => navigate(adminRoutes.users.child.user)}
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

export { UserPasswordForm };
