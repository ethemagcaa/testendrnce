import React, { FC, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl, FormattedMessage } from "react-intl";
import type { TreeNode } from "primereact/treenode";

import { featureMapService } from "@services/FeatureMapService";
import { RequestData } from "@library/HttpClient";
import { NodeResponseModel } from "@services/model/payload/response/feature-map/NodeResponseModel";
import { Modal } from "@components/modal/Modal";
import { TreeNodeContext } from "@modules/admin/feature-map/context/tree-node-context";
import { Button } from "@components/button/Button";

type RootNodeFormType = {
    tagName: string,
    name: string,
    status: boolean
}

const RootNodeFormModal: FC = () => {
    const intl = useIntl();
    const { nodes, rootNodeModalType, selectedNodeKey, setRootNodeModalTypeHandle, setNodesHandle } = useContext(TreeNodeContext);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<RootNodeFormType>({
        tagName: "",
        name: "",
        status: true
    });

    const findCurrentNode = (nodes: TreeNode[]): TreeNode | undefined => {
        for (const node of nodes)
            if (node.key === selectedNodeKey) {
                return node;

            } else if (node.children && node.children.length > 0) {
                const childNode = findCurrentNode(node.children);

                if (childNode)
                    return childNode;
            }

        return ;
    };

    useEffect(() => {
        if (rootNodeModalType?.type === "Edit") {
            const node = findCurrentNode(nodes);
            setInitialValues({
                tagName: node?.data.tag,
                name: node?.label || "",
                status: node?.data.status
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nodeSchema = Yup.object().shape({
        tagName: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Tag Name" }) })),
        name: Yup.string()
            .min(3, intl.formatMessage({ id: "Minimum {count} symbols" }, { count: 3 }))
            .max(50, intl.formatMessage({ id: "Maximum {count} symbols" }, { count: 50 }))
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Name" }) })),
        status: Yup.string()
            .required(intl.formatMessage({ id: "{name} required field." }, { name: intl.formatMessage({ id: "Status" }) }))
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: nodeSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            setStatus(false);

            const submitRequest: RequestData<NodeResponseModel> = {
                successCallback: (response: NodeResponseModel) => {
                    if (rootNodeModalType?.type === "Add") {
                        const newNode: TreeNode = {
                            key: String(response.id),
                            label: values.name,
                            leaf: true,
                            data: { status: values.status, tag: values.tagName }
                        };

                        nodes.push(newNode);
                        toast.success(`${response.name} ${intl.formatMessage({ id: "is created" })}`);

                    } else if (rootNodeModalType?.type === "Edit") {
                        const editNode = (nodes: TreeNode[]): TreeNode[] => {
                            return nodes.map(node => {
                                if (node.key === selectedNodeKey) {
                                    const updatedNode: TreeNode = {
                                        ...node,
                                        label: values.name,
                                        data: {
                                            ...node.data,
                                            status: values.status,
                                            tag: values.tagName
                                        }
                                    };
                                    return updatedNode;
                                } else if (node.children && node.children.length > 0) {
                                    return {
                                        ...node,
                                        children: editNode(node.children)
                                    };
                                }
                                return node;
                            });
                        };

                        const updatedNodes = editNode(nodes);
                        setNodesHandle(updatedNodes);
                        toast.success(`${response.name} ${intl.formatMessage({ id: "is updated" })}`);

                    } else if (rootNodeModalType?.type === "Add Child") {
                        const addChildNode = (nodes: TreeNode[]): TreeNode[] => {
                            return nodes.map(node => {
                                if (node.key === selectedNodeKey) {
                                    const newNode: TreeNode = {
                                        key: String(response.id),
                                        label: values.name,
                                        leaf: true,
                                        data: { status: values.status, tag: values.tagName, parentId: selectedNodeKey },
                                    };
                                    const updatedNode: TreeNode = {
                                        ...node,
                                        children: [...node.children || [], newNode],
                                        leaf: false
                                    };
                                    return updatedNode;
                                } else if (node.children && node.children.length > 0) {
                                    return {
                                        ...node,
                                        children: addChildNode(node.children)
                                    };
                                }
                                return node;
                            });
                        };

                        const updatedNodes = addChildNode(nodes);
                        setNodesHandle(updatedNodes);
                        toast.success(`${response.name} ${intl.formatMessage({ id: "is created" })}`);
                    }

                    setLoading(false);
                },
                errorCallback: () => {
                    setLoading(false);
                    setSubmitting(false);
                    setStatus(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                },
                data: {
                    tag: values.tagName,
                    name: values.name,
                    status: values.status,
                    id: rootNodeModalType?.type === "Edit" ? Number(selectedNodeKey) : 0,
                    parentId: rootNodeModalType?.type === "Add Child"
                        ? Number(selectedNodeKey)
                        : Number(findCurrentNode(nodes)?.data.parentId) || undefined
                }
            };

            if (rootNodeModalType?.type === "Add" || rootNodeModalType?.type === "Add Child")
                await featureMapService.getInstance().createNode(submitRequest);
            else
                await featureMapService.getInstance().updateNode(submitRequest);

            setRootNodeModalTypeHandle(undefined);
        }
    });

    return (
        <Modal title={intl.formatMessage({ id: `${rootNodeModalType?.type} Node` })}
            show={!!rootNodeModalType}
            handleClose={() => setRootNodeModalTypeHandle(undefined)} >
            <div className={"table-responsive"}>
                <form
                    className="form w-100"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    id="add_root_node_form"
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
                                htmlFor="tagName"
                                className="required fw-semibold fs-6 mb-2"
                            >
                                {intl.formatMessage({ id: "Tag Name" })}
                            </label>
                            <input
                                type="text"
                                placeholder={intl.formatMessage({ id: "Tag Name" })}
                                autoComplete="off"
                                {...formik.getFieldProps("tagName")}
                                className={clsx(
                                    "form-control form-control-solid mb-3 mb-lg-0",
                                    { "is-invalid": formik.touched.tagName && formik.errors.tagName },
                                    { "is-valid": formik.touched.tagName && !formik.errors.tagName },
                                )}
                            />
                            {formik.touched.tagName && formik.errors.tagName && (
                                <div className="fv-plugins-message-container">
                                    <span role="alert">{formik.errors.tagName}</span>
                                </div>
                            )}
                        </div>

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
                            className={"me-3"}
                            disabled={formik.isSubmitting || !formik.isValid}
                            onClick={() => setRootNodeModalTypeHandle(undefined)}
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
            </div>
        </Modal>
    );
};

export { RootNodeFormModal };
