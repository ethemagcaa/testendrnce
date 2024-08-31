export type ScenarioType = {
    id: number,
    cucumberFeatureId: number,
    name: string,
    exampleHeader: string | null,
    exampleBody: string | null,
    tags: string
}
