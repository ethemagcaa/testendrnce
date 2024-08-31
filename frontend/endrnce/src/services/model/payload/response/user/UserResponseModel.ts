export type UserResponseModel = {
    id?: number
    firstName: string
    lastName: string
    email: string
    lastLoginDate?: string
    providerTypeId: number
    password?: string,
    confirmPassword?: string,
    roles: { id: string, name: string}[]
}
