import React, { FC, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { JobNameContext } from "@modules/main/dashboards/cucumber-board/context/job-name-context";
import { JobNameType } from "@modules/main/dashboards/cucumber-board/types/job-name-type";
import { FormattedMessage } from "react-intl";

const TestCasesOfJobNamesFilter: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { jobName, setJobName } = useContext(JobNameContext);
    const jobNameList: JobNameType[] = [
        { name: "Eeproducttest", id: 0 },
        { name: "Regression", id: 1 }
    ];

    useEffect(() => {
        if (searchParams.size === 0)
            setJobName({ name: "Eeproducttest", id: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const jobNameParam = searchParams.get("jobName");
        if (jobNameParam) {
            const jobNameUrl = jobNameList.find(j => j.name === jobNameParam);
            if (jobNameUrl)
                setJobName(jobNameUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (jobName) {
            searchParams.set("jobName", jobName.name);
            setSearchParams(searchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobName]);

    const changeJobNameHandler = (selected: JobNameType | null) => {
        setJobName(selected);

        if (!selected)
            searchParams.delete("jobName");

        setSearchParams(searchParams);
    };

    return (
        <div className={"card mb-7"}>
            <div className={"card-body"}>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-shrink-0">
                        <span className="fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block">
                            <FormattedMessage id={"Job Names :"} />
                        </span>
                        <div className="flex-shrink-0">
                            <Select
                                value={jobName}
                                onChange={changeJobNameHandler}
                                options={jobNameList}
                                isSearchable
                                isClearable
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id.toString()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { TestCasesOfJobNamesFilter };