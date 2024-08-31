import React, { FC, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useIntl, FormattedMessage } from "react-intl";
import type { TreeNode } from "primereact/treenode";
import { AxiosError } from "axios";

import { Icon } from "@components/icon/Icon";
import { NodeDeleteResponseModel } from "@services/model/payload/response/feature-map/NodeDeleteResponseModel";
import { featureMapService } from "@services/FeatureMapService";
import { RequestData } from "@library/HttpClient";
import { TreeNodeContext } from "@modules/admin/feature-map/context/tree-node-context";
import { Button } from "@components/button/Button";
import { PromptModal } from "@components/modal/PromptModal";

const DeleteNodeModal: FC = () => {
    const { nodes, selectedNodeKey, isDeletingNode,
        setNodesHandle, setisDeletingNodeHandle } = useContext(TreeNodeContext);
    const intl = useIntl();
    const [loading, setLoading] = useState(false);

    const onClickHandle = () => {
        setLoading(true);
        const deleteNodeRequest: RequestData<NodeDeleteResponseModel> = {
            successCallback: (response: NodeDeleteResponseModel) => {
                const deleteNodes = (nodes: TreeNode[]) => {
                    return nodes.map(node => {
                        if (node.key === selectedNodeKey)
                            return null;

                        if (node.children)
                            node.children = deleteNodes(node.children);

                        return node;
                    }).filter((node): node is TreeNode => node !== null);
                };

                const newNodes = deleteNodes(nodes);
                setNodesHandle(newNodes);
                toast.success(response.message);
                setLoading(false);
                setisDeletingNodeHandle(false);
            },
            errorCallback: (error: AxiosError) => {
                if (error && error.status === 403)
                    toast.error(intl.formatMessage({ id: "You don't have enough permission" }));
                else if (error && error.status === 404)
                    toast.error(intl.formatMessage({ id: "Feature Map is not found" }));
                else if (error && error.status === 409)
                    toast.error(intl.formatMessage({ id: "This node has a child or children. Delete them first." }));
                else
                    toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                setLoading(false);
                setisDeletingNodeHandle(false);
            }
        };

        (async () => await featureMapService.getInstance().deleteNode(Number(selectedNodeKey), deleteNodeRequest))();
    };

    return (
        <PromptModal
            show={isDeletingNode}
            handleClose={() => setisDeletingNodeHandle(false)}
            title={intl.formatMessage({ id: "Delete Node" })}
        >
            <Icon
                iconType="solid"
                iconName="information-5"
                style={{ fontSize: "100px", marginBottom: "20px", display: "inline-block", color:"#F6C000" }}
            />
            <p>{intl.formatMessage({ id: "Are you sure you want to delete the node with the ID: " })} {selectedNodeKey}</p>

            <Button
                activeLight={"primary"}
                className={"me-3 fw-bold"}
                onClick={() => setisDeletingNodeHandle(false)}
            >
                <FormattedMessage id={"Discard"} />
            </Button>

            <Button
                baseColor={"danger"}
                className={"fw-bold"}
                onClick={onClickHandle}
            >
                {!loading
                    && (
                        <span className="indicator-label">
                            <FormattedMessage id="Delete" />
                        </span>
                    )}
                {loading && (
                    <span className="indicator-progress" style={{ display: "block" }}>
                        <FormattedMessage id={"Please wait..."} />
                        <span className="spinner-border spinner-border-sm align-middle ms-2" />
                    </span>
                )}
            </Button>
        </PromptModal>
    );
};

export { DeleteNodeModal };
