import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { queryClient } from "@react-query/queryClient";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { userService } from "@services/UserService";
import { RequestData } from "@library/HttpClient";
import { UserResponseModel } from "@services/model/payload/response/user/UserResponseModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { PasswordMeterComponent } from "@assets/ts/components";
import { UserFormRequestModel } from "@services/model/payload/request/user/UserFormRequestModel";


const UserForm: FC = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [loading, setLoading] = useState(false);
    const [initialValues,setInitialValues]= useState<UserFormRequestModel>({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword:"",
        providerTypeId: 0,
        roleIds: [],
    });

    useEffect(() => {
        PasswordMeterComponent.bootstrap();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId)
                try {
                    const response = await userService.getInstance().getUserById(userId);
                    setInitialValues(response);
                } catch (error) {
                    toast.error("User not found. Please check the user ID and try again.");
                }
        };

        (async () => await fetchUser())();
    }, [userId]);

    let passwordField = {};
    if(!userId)
        passwordField = {
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
        };

    const userSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "First Name" }) })),
        lastName: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Last Name" }) })),
        email: Yup.string()
            .email(intl.formatMessage({ id: "Invalid Email format." }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Email" }) })),
        roleIds: Yup.array()
            .of(Yup.string())
            .min(1, intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Roles" }) }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Roles" }) })),
        providerTypeId: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Provider" }) })),
        ...passwordField
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: userSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            let formDynamicData = {};
            if(!userId)
                formDynamicData = {
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                };
            else
                formDynamicData = {
                    id: Number(userId),
                };

            const data: UserFormRequestModel = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                roleIds: values.roleIds,
                providerTypeId:values.providerTypeId,
                ...formDynamicData
            };

            const submitRequest: RequestData<UserFormRequestModel> = {
                successCallback: (response: UserResponseModel) => {
                    setLoading(false);

                    toast.success(`${response.firstName} ${intl.formatMessage({ id:  userId ? "is updated" : "is created" })}`);

                    queryClient.clear();

                    navigate(adminRoutes.users.child.user);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data
            };

            if (userId)
                await userService.getInstance().updateUser(submitRequest);
            else
                await userService.getInstance().createUser(submitRequest);
        },
    });

    const usersBreadcrumbs: Array<PageLinkModel> = [
        {
            title: intl.formatMessage({ id: "User Management" }),
            path: adminRoutes.users.route,
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

    const options = [
        { value: "1", label: "User" },
        { value: "2", label: "Admin" }
    ];

    const optionProviderType = [
        { value: "1", label: "ON_SITE" },
        { value: "2", label: "GOOGLE" },
        { value: "3", label: "GITHUB" },
    ];

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: userId ? "Edit User" : "Add User" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="user_form"
            >
                <div className="fv-row mb-7">
                    <label
                        htmlFor="firstName"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        {intl.formatMessage({ id: "First Name" })}
                    </label>
                    <input
                        type="text"
                        placeholder={intl.formatMessage({ id: "First Name" })}
                        autoComplete="off"
                        {...formik.getFieldProps("firstName")}
                        className={clsx(
                            "form-control form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.firstName && formik.errors.firstName },
                            { "is-valid": formik.touched.firstName && !formik.errors.firstName },
                        )}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.firstName}</span>
                        </div>
                    )}
                </div>

                <div className="fv-row mb-7">
                    <label
                        htmlFor="lastName"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        {intl.formatMessage({ id: "Last Name" })}
                    </label>
                    <input
                        type="text"
                        placeholder={intl.formatMessage({ id: "Last Name" })}
                        autoComplete="off"
                        {...formik.getFieldProps("lastName")}
                        className={clsx(
                            "form-control form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.lastName && formik.errors.lastName },
                            { "is-valid": formik.touched.lastName && !formik.errors.lastName },
                        )}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.lastName}</span>
                        </div>
                    )}
                </div>

                <div className="fv-row mb-7">
                    <label htmlFor="email" className="required fw-semibold fs-6 mb-2">
                        {intl.formatMessage({ id: "Email" })}
                    </label>
                    <input
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="off"
                        {...formik.getFieldProps("email")}
                        className={clsx(
                            "form-control form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.email && formik.errors.email },
                            { "is-valid": formik.touched.email && !formik.errors.email },
                        )}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.email}</span>
                        </div>
                    )}
                </div>

                {!userId && (
                    <>
                        <div className="fv-row mb-7">
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
                        <div className="text-muted">
                            <FormattedMessage id="Use 8 or more characters with a mix of letters, numbers & symbols." />
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
                    </>
                )}
                <div className="fv-row mb-7">
                    <label
                        htmlFor="roleIds"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        {intl.formatMessage({ id: "Roles" })}
                    </label>
                    <Select
                        isMulti
                        {...formik.getFieldProps("roleIds")}
                        options={options}
                        classNamePrefix="select"
                        className={clsx(
                            "form-control-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.roleIds && formik.errors.roleIds },
                            { "is-valid": formik.touched.roleIds && !formik.errors.roleIds },
                        )}
                        onChange={(selectedOptions) => {
                            formik.setFieldValue("roleIds", selectedOptions.map(option => option.value));
                        }}
                        value={options.filter(option => formik.values.roleIds.find(role => String(role) === option.value))}
                    />
                    {formik.touched.roleIds && formik.errors.roleIds && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.roleIds}</span>
                        </div>
                    )}
                </div>

                <div className="fv-row mb-7">
                    <label
                        htmlFor="providerTypeId"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        {intl.formatMessage({ id: "Provider" })}
                    </label>
                    <Select
                        {...formik.getFieldProps("providerTypeId")}
                        className={clsx(
                            "w-300 mw-300px form-select-solid mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.providerTypeId && formik.errors.providerTypeId },
                            { "is-valid": formik.touched.providerTypeId && !formik.errors.providerTypeId }
                        )}
                        placeholder={intl.formatMessage({ id: "Select Provider Type" })}
                        defaultValue={optionProviderType[0]}
                        isClearable
                        isSearchable
                        options={optionProviderType}
                        onChange={(selectedOptions) => {
                            if(selectedOptions)
                                formik.setFieldValue("providerTypeId", selectedOptions.value);
                        }}
                        value={optionProviderType.filter(option => String(formik.values.providerTypeId) === option.value)}
                    />
                    {formik.touched.providerTypeId && formik.errors.providerTypeId && (
                        <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.providerTypeId}</span>
                        </div>
                    )}
                </div>

                <div className="text-center pt-15">
                    <button
                        type="reset"
                        onClick={() => navigate(adminRoutes.users.child.user)}
                        className="btn btn-light me-3"
                    >
                        {intl.formatMessage({ id: "Discard" })}
                    </button>
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

export { UserForm };
