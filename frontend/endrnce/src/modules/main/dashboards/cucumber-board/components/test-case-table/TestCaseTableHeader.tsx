import React, { FC } from "react";
import { DataTableSettings } from "@components/data-table/components/settings/DataTableSettings";
import TagInput from "@modules/main/dashboards/cucumber-board/components/TagInput";
import { TestCaseTableFilter }
    from "@modules/main/dashboards/cucumber-board/components/test-case-table/filter/TestCaseTableFilter";

const TestCaseTableHeader: FC = () => {
    return (
        <div className='card-header border-0 pt-6'>
            <div className='card-title'>
                <TagInput />
            </div>
            <div className='card-toolbar'>
                <TestCaseTableFilter />
                <DataTableSettings />
            </div>
        </div>
    );
};

export { TestCaseTableHeader };
