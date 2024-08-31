export type UserFormRequestModel = {
    id?: number
    firstName: string
    lastName: string
    email: string
    providerTypeId: number
    password?: string,
    confirmPassword?: string,
    roleIds: string[]
}
