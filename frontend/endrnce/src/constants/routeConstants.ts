const ADMIN_ROOT = "/admin";
const MAIN_ROOT = "/";

const ACCOUNT = `${ADMIN_ROOT}/account`;

const HEALTH_CHECK = `${ADMIN_ROOT}/health-check`;
const HEALTH_CHECK_VENDOR = `${ADMIN_ROOT}/health-check/vendor`;

const USERS_MANAGEMENT = `${ADMIN_ROOT}/user-management`;

const adminRoutes = {
    root: ADMIN_ROOT,
    dashboard: `${ADMIN_ROOT}/dashboard`,
    auth: `${ADMIN_ROOT}/auth`,
    account: {
        route: ACCOUNT,
        child: {
            settings: `${ACCOUNT}/settings`
        }
    },
    login: `${ADMIN_ROOT}/auth/login`,
    forgotPassword: `${ADMIN_ROOT}/auth/forgot-password`,
    registration: `${ADMIN_ROOT}/auth/registration`,
    terms: `${ADMIN_ROOT}/auth/terms`,
    accountSettings: `${ADMIN_ROOT}/account/settings`,
    healthCheck: {
        route: HEALTH_CHECK,
        child: {
            vendor: {
                route: HEALTH_CHECK_VENDOR,
                child: {
                    endpoint: `${HEALTH_CHECK_VENDOR}/:vendorId/endpoint`,
                    endpointForm: `${HEALTH_CHECK_VENDOR}/:vendorId/endpoint-form`,
                }
            },
            vendorForm: `${HEALTH_CHECK}/vendor-form`,
            environment: `${HEALTH_CHECK}/environment`,
            environmentForm: `${HEALTH_CHECK}/environment-form`,
        }
    },
    users: {
        route: USERS_MANAGEMENT,
        child: {
            user: `${USERS_MANAGEMENT}/users`,
            userForm: `${USERS_MANAGEMENT}/user-form`,
            passwordForm: `${USERS_MANAGEMENT}/password-form`,
            role: `${USERS_MANAGEMENT}/roles`, 
            roleForm: `${USERS_MANAGEMENT}/role-form`,
        }
    },
    featureMap: `${ADMIN_ROOT}/feature-map`
};

const mainRoutes = {
    root: MAIN_ROOT,
    dashboards: `${MAIN_ROOT}dashboards`,
    cucumber: `${MAIN_ROOT}dashboards/cucumber`,
    testResults: `${MAIN_ROOT}dashboards/test-results`,
    enterprise: `${MAIN_ROOT}dashboards/enterprise`,
    healthCheck: `${MAIN_ROOT}health-check`,
    featureMap: `${MAIN_ROOT}feature-map`,
};

const getLastSegments = (route: string, count: number = 1): string => {
    const segments = route.split("/");

    return segments.slice(-count).join("/");
};

const generateDynamicPath = (route: string, params: object) => {
    let path = route;
    for (const [key, value] of Object.entries(params))
        path = path.replace(`:${key}`, value);

    return path;
};

export {
    adminRoutes,
    mainRoutes,
    getLastSegments,
    generateDynamicPath
};
