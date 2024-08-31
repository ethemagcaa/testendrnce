import React, { createContext, FC, useState } from "react";
import { WithChildren } from "@library/Types";
import { EnvironmentResponseModel } from "@services/model/payload/response/allure/EnvironmentResponseModel";
import { CiResponseModel } from "@services/model/payload/response/allure/CiResponseModel";
import { SuiteResponseModel } from "@services/model/payload/response/allure/SuiteResponseModel";

type Props = {
    environment: EnvironmentResponseModel | null,
    setEnvironment: (environment: EnvironmentResponseModel | null) => void
    ci: CiResponseModel | null,
    setCi: (ci: CiResponseModel | null) => void
    lastSuite: SuiteResponseModel | null,
    setLastSuite: (lastSuite: SuiteResponseModel | null) => void
}

const initialTag: Props = {
    environment: null,
    ci: null,
    lastSuite: null,
    setLastSuite: () => {},
    setCi: () => {},
    setEnvironment: () => {}
};

const TestResultContext = createContext<Props>(initialTag);

const TestResultProvider: FC<WithChildren> = ({ children }) => {
    const [environment, setEnvironment] = useState<EnvironmentResponseModel | null>(null);
    const [ci, setCi] = useState<CiResponseModel | null>(null);
    const [lastSuite, setLastSuite] = useState<SuiteResponseModel | null>(null);

    return (
        <TestResultContext.Provider
            value={{
                environment,
                setEnvironment,
                ci,
                setCi,
                lastSuite,
                setLastSuite
            }}
        >
            {children}
        </TestResultContext.Provider>
    );
};

export { TestResultProvider, TestResultContext };
