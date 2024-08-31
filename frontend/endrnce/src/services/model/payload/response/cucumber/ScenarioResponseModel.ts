export interface ScenarioResponseModel {
    id: number;
    gherkin_feature_id: number;
    name: string;
    description: string;
    keyword: string;
    location: string;
    exampleHeader: string;
    exampleBody: string;
    featureName: string;
    tags: string;
}
