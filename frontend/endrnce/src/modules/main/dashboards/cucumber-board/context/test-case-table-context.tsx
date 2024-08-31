import React, { createContext, Dispatch, FC, SetStateAction, useState } from "react";

import { WithChildren } from "@library/Types";
import { TestCaseQueryModel } from "@modules/main/dashboards/cucumber-board/model/TestCaseQueryModel";

type Props = {
    dataForShowingTestStep?: TestCaseQueryModel | undefined
    setDataForShowingTestStep: Dispatch<SetStateAction<TestCaseQueryModel | undefined>>
};

const initial: Props = {
    setDataForShowingTestStep: () => { }
};

const TestCaseTableContext = createContext<Props>(initial);

const TestCaseTableProvider: FC<WithChildren> = ({ children }) => {
    const [dataForShowingTestStep, setDataForShowingTestStep] = useState<TestCaseQueryModel | undefined>();

    return (
        <TestCaseTableContext.Provider
            value={{
                dataForShowingTestStep,
                setDataForShowingTestStep,
            }}
        >
            {children}
        </TestCaseTableContext.Provider>
    );
};

export { TestCaseTableProvider, TestCaseTableContext };
