export const BASE_URL = process.env.PUBLIC_URL;
export const ENDRNCE_SERVICE = process.env.ENDRNCE_SERVICE;
export const ENDRNCE_SERVICE_API = `${ENDRNCE_SERVICE}/api/v1`;

export const OAUTH2_REDIRECT_URI = `${BASE_URL}/auth/login/oauth2/redirect`;

export const GOOGLE_AUTH_URL = `${ENDRNCE_SERVICE}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const FACEBOOK_AUTH_URL = `${ENDRNCE_SERVICE}/oauth2/authorize/facebook?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const GITHUB_AUTH_URL = `${ENDRNCE_SERVICE}/oauth2/authorize/github?redirect_uri=${OAUTH2_REDIRECT_URI}`;
