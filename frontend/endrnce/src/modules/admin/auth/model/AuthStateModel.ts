import { AUTHTYPE } from "@modules/admin/auth/enum/AuthType";

export interface AuthStateModel {
    isAuthenticated?: boolean
    token?: string
    expirationTime?: number
    authType?: AUTHTYPE
}
