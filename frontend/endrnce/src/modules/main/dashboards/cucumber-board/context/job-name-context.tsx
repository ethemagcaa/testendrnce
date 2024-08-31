import React, { createContext, FC, useState } from "react";
import { WithChildren } from "@library/Types";
import { JobNameType } from "@modules/main/dashboards/cucumber-board/types/job-name-type";

type JobNameProps = {
    jobName: JobNameType | null,
    setJobName: (jobName: JobNameType | null) => void,
    isTestCasesofJobNamesPage: boolean | null
}

const initial: JobNameProps = {
    jobName: null,
    setJobName: () => { },
    isTestCasesofJobNamesPage: null
};

const JobNameContext = createContext<JobNameProps>(initial);

const JobNameProvider: FC<WithChildren> = ({ children }) => {

    const [jobName, setJobName] = useState<JobNameType | null>(null);
    const isTestCasesofJobNamesPage = true;

    return (
        <JobNameContext.Provider
            value={{
                jobName,
                setJobName,
                isTestCasesofJobNamesPage
            }}
        >
            {children}
        </JobNameContext.Provider>
    );
};

export { JobNameProvider, JobNameContext };
