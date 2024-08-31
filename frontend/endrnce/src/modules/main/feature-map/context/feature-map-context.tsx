import React, { createContext, FC, useCallback, useEffect, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState, NodeChange, EdgeChange, Position } from "@xyflow/react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import dagre from "@dagrejs/dagre";

import { WithChildren } from "@library/Types";
import { RequestData } from "@library/HttpClient";
import { featureMapService } from "@services/FeatureMapService";
import { FeatureMapResponseModel } from "@services/model/payload/response/feature-map/FeatureMapResponseModel";

type FeatureMapProps = {
    nodes: Node[],
    edges: Edge[],
    selectedNodes: Node[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (nodes: Edge[]) => void,
    setSelectedNodes: (selectedNodes: Node[]) => void,
    onNodesChange: (changes: NodeChange[]) => void,
    onEdgesChange: (changes: EdgeChange[]) => void
    onLayout: (direction: string) => void
}

const initial: FeatureMapProps = {
    nodes: [],
    edges: [],
    selectedNodes: [],
    setNodes: () => {},
    setEdges: () => {},
    setSelectedNodes: () => {},
    onNodesChange: () => {},
    onEdgesChange: () => {},
    onLayout: () => {},
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 150;

const getLayoutElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: Edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node: Node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode: Node = {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };

        return newNode;
    });

    return { nodes: newNodes, edges };
};

const FeatureMapContext = createContext<FeatureMapProps>(initial);

const FeatureMapProvider: FC<WithChildren> = ({ children }) => {
    const [
        nodes,
        setNodes,
        onNodesChange
    ] = useNodesState<Node>([]);
    const [
        edges,
        setEdges,
        onEdgesChange
    ] = useEdgesState<Edge>([]);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

    const onLayout = useCallback(
        (direction: string) => {
            const {
                nodes: layoutNodes,
                edges: layoutEdges
            } = getLayoutElements(nodes, edges, direction);
            setNodes([...layoutNodes]);
            setEdges([...layoutEdges]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [nodes, edges]
    );

    const getNodesAndEdges = async () => {
        const request: RequestData<FeatureMapResponseModel[]> = {
            successCallback: (response: FeatureMapResponseModel[]) => {
                const createNodes = (nodeArr: FeatureMapResponseModel[]) => {
                    const nodes: Node[] = [];
                    const edges: Edge[] = [];
                    const position = { x: 0, y: 0 };
                    const edgeType = "smoothstep";

                    nodeArr.forEach((featureMap: FeatureMapResponseModel) => {
                        const isNoScenario = featureMap.scenarioList.length === 0;
                        const isRoot = featureMap.parentId === 0;
                        nodes.push({
                            id: String(featureMap.id),
                            position,
                            data: {
                                label: `${featureMap.name}\n${isNoScenario
                                    ? "No test cases are found"
                                    : featureMap.scenarioList.length === 1
                                        ? "1 test case"
                                        : featureMap.scenarioList.length + " test cases"}`,
                                testCases: featureMap.scenarioList
                            },
                            type: isRoot ? "input" : "default",
                            style: {
                                whiteSpace: "pre-wrap",
                                textAlign: "center",
                                backgroundColor: isNoScenario ? "#FFEEF3" : "#E9F3FF",
                                color: isNoScenario ? "#F8285A" : "#1B84FF",
                                borderColor: isNoScenario ? "#FFEEF3" : "#E9F3FF"
                            },
                            connectable: false
                        });

                        if (!isRoot)
                            edges.push({
                                id: `e${featureMap.id}-${featureMap.parentId}`,
                                source: String(featureMap.parentId),
                                target: String(featureMap.id),
                                type: edgeType,
                                animated: true
                            });
                    });

                    return { nodes, edges };
                };
                const {
                    nodes,
                    edges
                } = createNodes(response);
                const {
                    nodes: layoutNodes,
                    edges: layoutEdges
                } = getLayoutElements(nodes, edges);
                setNodes(layoutNodes);
                setEdges(layoutEdges);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.toString());
            }
        };
        await featureMapService.getInstance().getFlowNodes(request);
    };

    useEffect(() => {
        (async () => {
            await getNodesAndEdges();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FeatureMapContext.Provider
            value={{
                nodes,
                edges,
                selectedNodes,
                setNodes,
                setEdges,
                setSelectedNodes,
                onNodesChange,
                onEdgesChange,
                onLayout
            }}
        >
            {children}
        </FeatureMapContext.Provider>
    );
};

export { FeatureMapProvider, FeatureMapContext };
