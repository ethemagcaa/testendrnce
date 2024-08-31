import React, { FC, useContext } from "react";
import { TestCaseTableContext } from "@modules/main/dashboards/cucumber-board/context/test-case-table-context";
import { TestCaseQueryModel } from "@modules/main/dashboards/cucumber-board/model/TestCaseQueryModel";
import { useIntl } from "react-intl";

type Props = {
    data: TestCaseQueryModel
}

const TestCaseActionsCell: FC<Props> = ({ data }) => {
    const intl = useIntl();
    const { setDataForShowingTestStep } = useContext(TestCaseTableContext);

    const openTestStepsModal = () => {
        setDataForShowingTestStep(data);
    };

    return (
        <div className={"dropdown dropdown-inline"}>
            <button
                className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                onClick={openTestStepsModal}
                data-bs-toggle="tooltip"
                title={intl.formatMessage({ id: "Show Test Steps" })}
            >
                <i className="ki-duotone ki-square-brackets fs-2x">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                </i>
            </button>
        </div>
    );
};


export default TestCaseActionsCell;
