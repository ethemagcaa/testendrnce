import React, { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { getCSSVariableValue } from "@assets/ts/_utils";
import { TestResultContext } from "@modules/main/dashboards/test-results/context/test-result-context";
import { ChartsWidgetDonut } from "@components/widget/apex-charts/ChartsWidgetDonut";

const TestResultsSummary: FC = () => {
    const { lastSuite } = useContext(TestResultContext);
    const intl = useIntl();
    const [labels, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<number[]>([]);

    const successColor = getCSSVariableValue("--bs-teal");
    const failedColor = getCSSVariableValue("--bs-red");
    const brokenColor = getCSSVariableValue("--bs-orange");
    const skippedColor = getCSSVariableValue("--bs-gray");
    const unknownColor = getCSSVariableValue("--bs-purple");

    const colors = [
        successColor,
        failedColor,
        brokenColor,
        skippedColor,
        unknownColor
    ];

    useEffect(() => {
        if(lastSuite) {
            setSeries([ lastSuite.passed, lastSuite.failed, lastSuite.broken, lastSuite.unknown]);

            setLabels( [
                intl.formatMessage({ id: "Success" }),
                intl.formatMessage({ id: "Failed" }),
                intl.formatMessage({ id: "Broken" }),
                intl.formatMessage({ id: "Unknown" })
            ]);
        } else {
            setSeries([]);
            setLabels([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSuite]);

    return (
        <>
            <ChartsWidgetDonut className='card-xl-stretch' chartObj={{ title: intl.formatMessage({ id: "Suite Summary" }), colors, series: series, labels }} />
        </>
    );
};

export default TestResultsSummary;
