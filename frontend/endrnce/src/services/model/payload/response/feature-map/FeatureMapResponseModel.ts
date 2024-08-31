import { ScenarioType } from "@modules/main/feature-map/types/scenario-type";

export interface FeatureMapResponseModel {
    id: number,
    parentId: number,
    name: string,
    parentPath: string,
    status: boolean,
    scenarioList: ScenarioType[]
}
