export interface FeatureResponseModel {
    id: number;
    name: string;
    description: string;
    keyword:string;
    language:string;
    gherkinChildrenList:object;
    gherkinFeature2TagList:object;
}
