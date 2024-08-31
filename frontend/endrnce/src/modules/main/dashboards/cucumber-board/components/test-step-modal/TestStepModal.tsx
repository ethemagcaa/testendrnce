import React, { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { TestCaseQueryModel } from "@modules/main/dashboards/cucumber-board/model/TestCaseQueryModel";
import { Modal } from "@components/modal/Modal";
import { TestCaseTableContext } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { TestStepResponseModel } from "@services/model/payload/response/cucumber/TestStepResponseModel";
import { RequestData } from "@library/HttpClient";
import { cucumberService } from "@services/CucumberService";

type Props = {
    data: TestCaseQueryModel
}

const TestStepModal: FC<Props> = ({ data }) => {
    const { dataForShowingTestStep, setDataForShowingTestStep } = useContext(TestCaseTableContext);
    const [testSteps, setTestSteps] = useState<TestStepResponseModel[]>([]);

    useEffect(() => {
        (async () => getTestSteps())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTestSteps = async () => {
        const request: RequestData<TestStepResponseModel[]> = {
            successCallback: (response: TestStepResponseModel[]) => {
                setTestSteps(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await cucumberService.getInstance().getTestSteps(request, data.id || 0);
    };

    return (
        <Modal title={data.name} show={!!dataForShowingTestStep} handleClose={() => setDataForShowingTestStep(undefined)} >
            <div className={"table-responsive"}>
                <table className="table table-hover table-striped gs-7 gy-3 gx-3">
                    <tbody>
                        {
                            testSteps.map(
                                step => (
                                    <tr key={step.id}>
                                        <td>
                                            <strong>{step?.keyword}</strong>
                                        </td>
                                        <td>{step?.text}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export { TestStepModal };
