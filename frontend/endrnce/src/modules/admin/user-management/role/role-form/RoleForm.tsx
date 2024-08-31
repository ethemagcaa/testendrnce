import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import { queryClient } from "@react-query/queryClient";
import { useNavigate, useParams } from "react-router-dom";

import { PageLinkModel } from "@modules/admin/layout/model/PageLinkModel";
import { RequestData } from "@library/HttpClient";
import { RoleResponseModel } from "@services/model/payload/response/role/RoleResponseModel";
import { PageTitle } from "@modules/admin/layout/components/page-title/PageTitle";
import { adminRoutes } from "@/constants/routeConstants";
import { Button } from "@components/button/Button";
import { RoleFormModel } from "@services/model/payload/request/role/RoleFormModel";
import { roleService } from "@services/RoleService";


const RoleForm: FC = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { roleId } = useParams<{ roleId: string }>();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues]= useState<RoleFormModel>({
        name: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (roleId)
                try {
                    const response = await roleService.getInstance().getRoleById(roleId);
                    setInitialValues({
                        id: String(response.id),
                        name: response.name
                    });
                } catch (error) {
                    toast.error("User not found. Please check the user ID and try again.");
                }
        };

        (async () => await fetchUser())();
    }, [roleId]);

    const userSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "Minimum 3 characters required")
            .required("Role is required"),
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: userSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<RoleFormModel> = {
                successCallback: (response: RoleResponseModel) => {
                    setLoading(false);

                    toast.success(`${response.name} ${intl.formatMessage({ id:  roleId ? "is updated" : "is created" })}`);

                    queryClient.clear();

                    navigate(adminRoutes.users.child.role);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    id: roleId,
                    name: formik.values.name
                }
            };

            if (roleId)
                await roleService.getInstance().updateRole(submitRequest);
            else
                await roleService.getInstance().createRole(submitRequest);
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

    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: roleId ? "Edit Role" : "Add Role" })}
            </PageTitle>

            <form
                className="form w-100"
                onSubmit={formik.handleSubmit}
                noValidate
                id="user_form"
            >
                <div className="fv-row mb-7">
                    <label
                        htmlFor="newRole"
                        className="required fw-semibold fs-6 mb-2"
                    >
                        New Role
                    </label>
                    <input
                        type="text"
                        placeholder="Enter role"
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

                <div className="text-center pt-15">
                    <button
                        type="reset"
                        onClick={() => navigate(adminRoutes.users.child.role)}
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

export { RoleForm };
