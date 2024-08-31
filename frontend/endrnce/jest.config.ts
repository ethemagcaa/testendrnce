import type { Config } from "jest";

const config: Config = {
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx$": "ts-jest",
        "^.+\\.ts$": "ts-jest"
    },
    setupFilesAfterEnv: [
        "<rootDir>/src/setupTests.ts"
    ],
    moduleNameMapper: {
        "^@assets(.*)$": "<rootDir>/src/assets$1",
        "^@components(.*)$": "<rootDir>/src/components$1",
        "^@context(.*)$": "<rootDir>/src/context$1",
        "^@hooks(.*)$": "<rootDir>/src/hooks$1",
        "^@i18n(.*)$": "<rootDir>/src/i18n$1",
        "^@layout(.*)$": "<rootDir>/src/layout$1",
        "^@library(.*)$": "<rootDir>/src/library$1",
        "^@modules(.*)$": "<rootDir>/src/modules$1",
        "^@query-client(.*)$": "<rootDir>/src/query-client$1",
        "^@routing(.*)$": "<rootDir>/src/routing$1",
        "^@store(.*)$": "<rootDir>/src/store$1",
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less|s[ac]ss)$": "<rootDir>/__mocks__/styleMock.js"
    }
};

export default config;


