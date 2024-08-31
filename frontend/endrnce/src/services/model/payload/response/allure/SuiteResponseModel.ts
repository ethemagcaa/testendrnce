export interface SuiteResponseModel {
    id: number;
    name: string;
    failed: number;
    broken: number;
    skipped: number;
    passed: number;
    unknown: number;
    total: number;
    start: string;
    stop: string;
    duration: number;
}
