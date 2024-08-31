import React, { FC, useRef, useContext } from "react";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { PrimeReactProvider } from "primereact/api";
import toast from "react-hot-toast";
import { ContextMenu } from "primereact/contextmenu";
import { FormattedMessage, useIntl } from "react-intl";
import { AxiosError } from "axios";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Icon } from "@components/icon/Icon";
import { RequestData } from "@library/HttpClient";
import { NodeResponseModel } from "@services/model/payload/response/feature-map/NodeResponseModel";
import { featureMapService } from "@services/FeatureMapService";
import { Button } from "@components/button/Button";
import { Card } from "@components/card/Card";
import { Separator } from "@components/separator/Separator";
import { RootNodeFormModal } from "@modules/admin/feature-map/modal/RootNodeFormModal";
import { DeleteNodeModal } from "@modules/admin/feature-map/modal/DeleteNodeModal";
import { TreeNodeContext } from "@modules/admin/feature-map/context/tree-node-context";

const FeatureTree: FC = () => {
    const intl = useIntl();
    const { nodes, selectedNodeKey, rootNodeModalType, loading, isDeletingNode,
        setisDeletingNodeHandle, setLoadingHandle, setRootNodeModalTypeHandle, setNodesHandle, setSelectedNodeKeyHandle } = useContext(TreeNodeContext);
    const cm = useRef<ContextMenu>(null);
    const menu = [
        {
            label: intl.formatMessage({ id: "Add Child Node" }),
            icon: "bi bi-node-plus",
            command: () => {
                setRootNodeModalTypeHandle({ type: "Add Child" });
            }
        },

        {
            label: intl.formatMessage({ id: "Edit Node" }),
            icon: "bi bi-gear",
            command: () => {
                setRootNodeModalTypeHandle({ type: "Edit" });
            }
        },

        {
            label: intl.formatMessage({ id: "Delete Node" }),
            icon: "bi bi-trash",
            command: () => {
                setisDeletingNodeHandle(true);
            }
        }
    ];

    const onDragDropHandle = (e: TreeDragDropEvent) => {
        setLoadingHandle(true);
        const editDragNodeRequest: RequestData<NodeResponseModel> = {
            successCallback: (response: NodeResponseModel) => {
                const editDragNode = (nodes: TreeNode[]): TreeNode[] => {
                    return nodes.map(node => {
                        if (node.key === e.dragNode.key) {
                            const updatedNode: TreeNode = {
                                ...node,
                                data: {
                                    ...node.data,
                                    parentId: Number(e.dropNode?.key)
                                }
                            };
                            return updatedNode;

                        } else if (node.children && node.children.length > 0) {
                            return {
                                ...node,
                                children: editDragNode(node.children)
                            };
                        }
                        return node;
                    });
                };
                const newNodes = editDragNode(e.value);
                setNodesHandle(newNodes);
                toast.success(intl.formatMessage({ id: "Successfully Moved Node with ID: " }) + response.id);
                setLoadingHandle(false);
            },
            errorCallback: (error: AxiosError) => {
                if (error && error.status === 403)
                    toast.error(intl.formatMessage({ id: "You don't have enough permission" }));
                else
                    toast.error(intl.formatMessage({ id: "Sorry, looks like there are some errors detected, please try again." }));
                setLoadingHandle(false);
            },
            data: {
                tag: e.dragNode.data.tag,
                name: e.dragNode.label || "",
                status: e.dragNode.data.status,
                id: Number(e.dragNode.key),
                parentId: Number(e.dropNode?.key)
            }
        };

        (async () => await featureMapService.getInstance().updateNode(editDragNodeRequest))();
    };

    return (
        <Card className="card-xxl-stretch mb-xl-3">
            <div className="card-header border-0">
                <div className="card-title">
                    <FormattedMessage id={"Feature Tree"} />
                </div>
                <div className="card-toolbar">
                    <Button baseColor="primary" activeLight="primary" onClick={() => setRootNodeModalTypeHandle({ type: "Add" })}>
                        <Icon iconType="duotone" iconName="plus" className="fs-3" />
                        <FormattedMessage id={"Add Root Node"} />
                    </Button>
                </div>
            </div>
            <Separator />
            <PrimeReactProvider>
                <ContextMenu model={menu} ref={cm} pt={{
                    menu: { style: { margin: "0px", padding: "0px", fontFamily: "Inter, Helvetica, \"sans-serif\"" } }
                }} />
                <Tree
                    value={nodes}
                    onContextMenu={(e) => {
                        cm.current?.show(e.originalEvent);
                    }}
                    contextMenuSelectionKey={selectedNodeKey}
                    onContextMenuSelectionChange={(e) => setSelectedNodeKeyHandle(e.value as string | undefined)}
                    dragdropScope="key"
                    onDragDrop={onDragDropHandle}
                    className="card-body pt-2 border-0"
                    pt={{
                        root: { style: { fontFamily: "Inter, Helvetica, \"sans-serif\"" } },
                        loadingOverlay: { style: { backgroundColor: "white" } }
                    }}
                    loading={loading}
                    emptyMessage={intl.formatMessage({ id: "There are not any nodes in this tree currently." })} />
                {!!rootNodeModalType && <RootNodeFormModal />}
                {isDeletingNode && <DeleteNodeModal />}
            </PrimeReactProvider>
        </Card>
    );
};

export { FeatureTree };
