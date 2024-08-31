import React, { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { DataTableContext } from "@components/data-table/context/data-table-context";
import { useDebounce } from "@components/data-table/core/helpers";
import { initialQueryState } from "@components/data-table/model/QueryStateModel";
import { Icon } from "@components/icon/Icon";

const DataTableSearch: FC = () => {
    const intl = useIntl();
    const { updateState } = useContext(DataTableContext);
    const [searchTerm, setSearchTerm] = useState<string>("");
    // Debounce search term so that it only gives us latest value ...
    // ... if searchTerm has not been updated within last 500ms.
    // The goal is to only have the API call fire when user stops typing ...
    // ... so that we aren't hitting our API rapidly.
    const debouncedSearchTerm = useDebounce(searchTerm, 150);
    // Effect for API call
    useEffect(
        () => {
            if (debouncedSearchTerm !== undefined && searchTerm !== undefined)
                updateState({ search: debouncedSearchTerm, ...initialQueryState });

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
    );

    return (
        <div className='d-flex align-items-center position-relative my-1'>
            <Icon iconName='magnifier' className='fs-1 position-absolute ms-6' />
            <input
                type='text'
                data-kt-user-table-filter='search'
                className='form-control form-control-solid w-250px ps-14'
                placeholder={intl.formatMessage({ id: "Search..." })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export { DataTableSearch };
