import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl/src/types";

import TestCaseActionsCell
    from "@modules/main/dashboards/cucumber-board/components/test-case-table/columns/TestCaseActionsCell";
import { TestCaseQueryModel } from "@modules/main/dashboards/cucumber-board/model/TestCaseQueryModel";
import TestCaseTagCell from "@modules/main/dashboards/cucumber-board/components/test-case-table/columns/TestCaseTagCell";

const testCasesColumns = (intl: IntlShape): ColumnDef<TestCaseQueryModel>[] => {
    return  [
        {
            header: intl.formatMessage({ id: "Feature" }),
            accessorKey: "featureName",
            id: "featureName",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Test Case" }),
            accessorKey: "name",
            id: "name",
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Tags" }),
            accessorKey: "tags",
            id: "tags",
            cell: info => <TestCaseTagCell tags={info.getValue<string>()} />
        },
        {
            header: intl.formatMessage({ id: "Actions" }),
            enableSorting: false,
            cell: props => <TestCaseActionsCell data={props.row.original} />,
        },
    ];
};

export { testCasesColumns };
