import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { HealthCheckQueryModel } from "@modules/main/health-check/model/HealthCheckQueryModel";
import Badge from "@components/badge/Badge";
import DateFormatter from "@library/DateFormatter";

const healthCheckColumns = (intl: IntlShape): ColumnDef<HealthCheckQueryModel>[] => {
    return  [
        {
            header: intl.formatMessage({ id: "Vendor Name" }),
            accessorKey: "vendorName",
            id: "vendorName",
            enableSorting: false,
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Endpoint Name" }),
            accessorKey: "endpointName",
            id: "endpointName",
            enableSorting: false,
            cell: info => info.getValue()
        },
        {
            header: intl.formatMessage({ id: "Check Date" }),
            accessorKey: "checkDate",
            id: "checkDate",
            enableSorting: false,
            cell: info => {
                const locale = intl.locale;
                return DateFormatter.changeLocale(locale).format(info.getValue<string>());
            },
        },
        {
            header: intl.formatMessage({ id: "Status" }),
            accessorKey: "status",
            id: "status",
            enableSorting: false,
            cell: info => {
                const value = info.getValue();
                const color = value ? "success" : "danger";
                const label = value ? intl.formatMessage({ id: "Healthy" }) : intl.formatMessage({ id: "Unhealthy" });

                return (<Badge color={color}>{label}</Badge>);
            },
        },

    ];
};

export { healthCheckColumns };
