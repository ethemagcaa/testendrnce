export interface RegisterRequestModel {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword?: string
    acceptTerms?: boolean
}
