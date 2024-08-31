import React, { FC, useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import clsx from "clsx";
import { useIntl } from "react-intl";

import { WithChildren } from "@library/Types";
import { SelectOption } from "@components/refresh-interval/model/SelectOption";

type Props = {
    className?: string
    backgroundStyle?: "transparent" | "solid" | ""
    isDisabled?: boolean
    options?: SelectOption[]
    triggerMethod: () => void
}

const defaultProps: Partial<Props> = {
    isDisabled: false
};

const RefreshInterval: FC<Props & WithChildren> = (props) => {
    const {
        className,
        backgroundStyle,
        isDisabled,
        options,
        triggerMethod
    } = { ...defaultProps, ...props };
    const intl = useIntl();

    let option: SelectOption[] = [];
    if(!options)
        option = [
            { value: "5s", label: "5s" },
            { value: "15s", label: "15s", isDefault: true },
            { value: "30s", label: "30s" },
            { value: "1m", label: "1m" },
            { value: "5m", label: "5m" },
            { value: "", label: intl.formatMessage({ id: "Disable" }) }
        ];

    const [refreshInterval, setRefreshInterval] = useState<string>(option.find(elm => elm.isDefault)?.value || "");

    const handleRefreshChange = (selectedOption: SingleValue<{ value: string, label: string }>) => {
        if (selectedOption)
            setRefreshInterval(selectedOption.value);
    };

    useEffect(() => {
        const intervalMs = convertToMilliseconds(refreshInterval);

        if(intervalMs) {
            const interval = setInterval(async () => {
                await triggerMethod();
            }, intervalMs);

            return () => clearInterval(interval);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [refreshInterval]);

    const convertToMilliseconds = (interval: string) => {
        const unit = interval.slice(-1);
        const amount = parseInt(interval.slice(0, -1));
        switch (unit) {
            case "s":
                return amount * 1000;
            case "m":
                return amount * 1000 * 60;
            default:
                return null;
        }
    };
    return (
        <Select
            className={clsx(
                "react-select-styled",
                className && className,
                backgroundStyle && `react-select-${backgroundStyle}`,
            )}
            isDisabled={isDisabled}
            options={option}
            onChange={(selectedOption) => handleRefreshChange(selectedOption) }
            classNamePrefix='react-select'
            defaultValue={option.find(elm => elm.isDefault)}
        />
    );
};

export { RefreshInterval };
