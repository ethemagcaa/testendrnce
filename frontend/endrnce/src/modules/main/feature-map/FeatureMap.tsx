import React, { FC } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FeatureMapProvider } from "@modules/main/feature-map/context/feature-map-context";
import { FeatureMapFlow } from "@modules/main/feature-map/components/FeatureMapFlow";

const FeatureMap: FC = () => {

    return (
        <div style={{ position: "absolute", width: "100%", height: "100%", top: "70px", left: "0px" }}>
            <ReactFlowProvider>
                <FeatureMapProvider>
                    <FeatureMapFlow />
                </FeatureMapProvider>
            </ReactFlowProvider>
        </div>
    );
};

export { FeatureMap };
