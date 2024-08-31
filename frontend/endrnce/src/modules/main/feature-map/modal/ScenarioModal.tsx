import React, { FC, useContext } from "react";
import { Node } from "@xyflow/react";

import { Modal } from "@components/modal/Modal";
import { FeatureMapContext } from "@modules/main/feature-map/context/feature-map-context";
import { ScenarioType } from "@modules/main/feature-map/types/scenario-type";

type NodeData = {
    label: string,
    testCases: ScenarioType[]
}

const ScenarioModal: FC = () => {
    const { nodes,
        selectedNodes,
        setNodes,
        setSelectedNodes,
    } = useContext(FeatureMapContext);
    const selectedNode = selectedNodes[0];
    const data = selectedNode.data as NodeData;

    return (
        <Modal
            title={data.label.split("\n")[0]}
            show={selectedNodes.length > 0}
            handleClose={() => {
                setSelectedNodes([]);
                const newNodes = nodes.map((node) => {
                    if (node.id === selectedNode.id) {
                        const updatedNode: Node = {
                            ...node,
                            selected: undefined
                        };
                        return updatedNode;
                    }
                    return node;
                });
                setNodes(newNodes);
            }}
            dialogClassName={"modal-dialog modal-dialog-scrollable"}
        >
            <div className={"table-responsive"}>
                <table className="table table-hover table-striped gs-7 gy-3 gx-3">
                    <tbody>
                        {
                            data.testCases.map(
                                testCase => (
                                    <tr key={testCase.id}>
                                        <td>
                                            <strong>{testCase.id}</strong>
                                        </td>
                                        <td>{testCase.name}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export { ScenarioModal };
