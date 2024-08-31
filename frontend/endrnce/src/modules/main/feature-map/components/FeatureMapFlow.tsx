import React, { FC, useContext, useCallback } from "react";
import {
    ReactFlow,
    ConnectionLineType,
    Panel,
    Controls,
    MiniMap,
    Background,
    useOnSelectionChange,
    Node
} from "@xyflow/react";
import { FormattedMessage } from "react-intl";
import "@xyflow/react/dist/style.css";

import { Button } from "@components/button/Button";
import { useThemeMode } from "@modules/admin/layout/context/theme-mode-context";
import { FeatureMapContext } from "@modules/main/feature-map/context/feature-map-context";
import { ScenarioModal } from "@modules/main/feature-map/modal/ScenarioModal";

const FeatureMapFlow: FC = () => {
    const { mode } = useThemeMode();
    const {
        nodes,
        edges,
        selectedNodes,
        onNodesChange,
        onEdgesChange,
        onLayout,
        setSelectedNodes
    } = useContext(FeatureMapContext);

    const onChange = useCallback(({ nodes }: { nodes: Node[] }) => {
        setSelectedNodes(nodes);
    }, [setSelectedNodes]);

    useOnSelectionChange({
        onChange
    });

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                colorMode={mode}
            >
                <Panel position="top-center">
                    <Button
                        baseColor="light"
                        activeLight="primary"
                        utilityME={2}
                        onClick={() => onLayout("TB")}
                    >
                        <FormattedMessage id={"Vertical Layout"} />
                    </Button>
                    <Button
                        baseColor="light"
                        activeLight="primary"
                        utilityME={2}
                        onClick={() => onLayout("LR")}
                    >
                        <FormattedMessage id={"Horizontal Layout"} />
                    </Button>
                </Panel>
                <Controls position="top-left" />
                <MiniMap position="top-right" />
                <Background gap={12} size={1} />
            </ReactFlow>
            {(selectedNodes.length > 0) && <ScenarioModal />}
        </>
    );
};

export { FeatureMapFlow };
