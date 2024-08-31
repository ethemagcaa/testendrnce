export type EndpointRequestModel = {
    id?: number
    healthCheckVendorId?: number
    name: string
    period?: number
    path: string
    requestType: string
    requestPayload?: string
    requestHeader?: string
    nextRunTime?: string
    status: boolean
}
