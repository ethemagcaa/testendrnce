import React, { createContext, FC, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { TreeNode } from "primereact/treenode";

import { RequestData } from "@library/HttpClient";
import { WithChildren } from "@library/Types";
import { NodeResponseModel } from "@services/model/payload/response/feature-map/NodeResponseModel";
import { featureMapService } from "@services/FeatureMapService";

type ModalType = {
    type: "Add" | "Edit" | "Add Child"
}

type TreeNodeProps = {
    rootNodeModalType: ModalType | undefined,
    selectedNodeKey: string | undefined,
    nodes: TreeNode[],
    loading: boolean,
    isDeletingNode: boolean,
    setisDeletingNodeHandle: (isDeletingNode: boolean) => void,
    setLoadingHandle: (loading: boolean) => void,
    setRootNodeModalTypeHandle: (isRootNodeModalOpen: ModalType | undefined) => void,
    setNodesHandle: (nodes: TreeNode[]) => void,
    setSelectedNodeKeyHandle: (selectedNodeKey: string | undefined) => void
}

const initial: TreeNodeProps = {
    rootNodeModalType: undefined,
    nodes: [],
    selectedNodeKey: undefined,
    loading: false,
    isDeletingNode: false,
    setisDeletingNodeHandle: () => { },
    setLoadingHandle: () => { },
    setRootNodeModalTypeHandle: () => { },
    setNodesHandle: () => { },
    setSelectedNodeKeyHandle: () => { }
};

const TreeNodeContext = createContext<TreeNodeProps>(initial);

const TreeNodeProvider: FC<WithChildren> = ({ children }) => {
    const [rootNodeModalType, setRootNodeModalType] = useState<ModalType>();
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [selectedNodeKey, setSelectedNodeKey] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [isDeletingNode, setisDeletingNode] = useState(false);

    const setRootNodeModalTypeHandle = (isRootNodeModalOpen: ModalType | undefined) => {
        setRootNodeModalType(isRootNodeModalOpen);
    };

    const setNodesHandle = (nodes: TreeNode[]) => {
        setNodes(nodes);
    };

    const setSelectedNodeKeyHandle = (selectedNodeKey: string | undefined) => {
        setSelectedNodeKey(selectedNodeKey);
    };

    const setLoadingHandle = (loading: boolean) => {
        setLoading(loading);
    };

    const setisDeletingNodeHandle = (isDeletingNode: boolean) => {
        setisDeletingNode(isDeletingNode);
    };

    useEffect(() => {
        (async () => {
            await getNodes();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNodes = async () => {
        setLoadingHandle(true);
        const request: RequestData<NodeResponseModel[]> = {
            successCallback: (response: NodeResponseModel[]) => {
                const createNodes = (nodeArr: NodeResponseModel[]) => {
                    const nodeMap: { [key: string]: TreeNode } = {};
                    const rootNodes: TreeNode[] = [];

                    nodeArr.forEach((node) => {
                        nodeMap[node.id] = {
                            key: String(node.id),
                            label: node.name,
                            leaf: true,
                            data: { status: node.status, tag: node.tag, parentId: node.parentId },
                            children: []
                        };
                    });

                    nodeArr.forEach((node) => {
                        if (node.parentId) {
                            const parent = nodeMap[node.parentId];
                            parent.children?.push(nodeMap[node.id]);
                            parent.leaf = false;
                        } else {
                            rootNodes.push(nodeMap[node.id]);
                        }
                    });

                    return { rootNodes };
                };
                const { rootNodes } = createNodes(response);
                setNodesHandle(rootNodes);
                setLoadingHandle(false);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.toString());
                setLoadingHandle(false);
            }
        };
        await featureMapService.getInstance().getTreeNodes(request);
    };

    return (
        <TreeNodeContext.Provider
            value={{
                nodes,
                rootNodeModalType,
                selectedNodeKey,
                loading,
                isDeletingNode,
                setisDeletingNodeHandle,
                setLoadingHandle,
                setRootNodeModalTypeHandle,
                setNodesHandle,
                setSelectedNodeKeyHandle,
            }}
        >
            {children}
        </TreeNodeContext.Provider>
    );
};

export { TreeNodeProvider, TreeNodeContext };
