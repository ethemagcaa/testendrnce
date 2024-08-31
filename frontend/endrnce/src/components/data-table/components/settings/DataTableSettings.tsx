import React, { useContext } from "react";

import { FormattedMessage } from "react-intl";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { queryClient } from "@react-query/queryClient";
import { initialQueryState } from "@components/data-table/model/QueryStateModel";

const DataTableSettings: React.FC = () => {
    const { table } = useContext(DataTableContext);
    const { updateState } = useContext(DataTableContext);

    const refreshData = () => {
        queryClient.clear();
        updateState(initialQueryState);
    };

    return (
        <div className="m-0">
            <button className="btn btn-light-primary me-3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                <i className="ki-duotone ki-setting-4 fs-6 text-muted me-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                </i>
                <FormattedMessage id="Table Settings" />
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-gray-800 menu-state-bg-light-primary w-250px w-md-300px" data-kt-menu="true" id="kt_menu_64b7762844884">
                <div className="menu-item px-3">
                    <div className="menu-content fs-6 text-dark fw-bold px-3 py-4">
                        <FormattedMessage id="Quick Actions" />
                    </div>
                </div>
                <div className="separator mb-3 opacity-75"></div>
                <div className="menu-item px-3">
                    <a href="#!" onClick={refreshData} className="menu-link px-3" >
                        <i className="ki-duotone ki-arrows-circle mx-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                        </i>
                        <FormattedMessage id="Refresh Data" />
                    </a>
                </div>
                <div className="px-7 py-5">
                    <div className="fs-5 text-dark fw-bold">
                        <FormattedMessage id="Column Visibility" />
                    </div>
                </div>
                <div className="separator border-gray-200"></div>
                <div className="px-7 py-5">
                    <div className="mb-10">
                        <div className="form-check form-check-custom form-check-solid mb-5">
                            <label className="form-check-label">
                                <input
                                    className="form-check-input"
                                    {...{
                                        type: "checkbox",
                                        checked: table.getIsAllColumnsVisible(),
                                        onChange: table.getToggleAllColumnsVisibilityHandler(),
                                    }}
                                />
                                <span className="form-check-label">
                                    <FormattedMessage id="Toggle All" />
                                </span>
                            </label>
                        </div>
                        {table.getAllLeafColumns().map(column => {
                            return (
                                <div key={column.id} className="form-check form-check-custom form-check-solid mb-5">
                                    <label className="form-check-label">
                                        <input
                                            className="form-check-input"
                                            {...{
                                                type: "checkbox",
                                                checked: column.getIsVisible(),
                                                onChange: column.getToggleVisibilityHandler(),
                                            }}
                                        />
                                        <span className="form-check-label">
                                            {column.columnDef.header?.toString()}
                                        </span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { DataTableSettings };
