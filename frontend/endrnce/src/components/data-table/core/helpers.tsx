import { useEffect, useState } from "react";
import qs from "qs";

import { QueryStateModel } from "@components/data-table/model/QueryStateModel";

function isNotEmpty(obj: unknown) {
    return obj !== undefined && obj !== null && obj !== "";
}

// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
function stringifyRequestQuery(state: QueryStateModel): string {
    const pagination = qs.stringify(state, { filter: ["page", "items_per_page"], skipNulls: true });
    const sort = qs.stringify(state, { filter: ["sort", "order"], skipNulls: true });
    const search = isNotEmpty(state.search)
        ? qs.stringify(state, { filter: ["search"], skipNulls: true })
        : "";

    const filter = state.filter
        ? Object.entries(state.filter as object)
            .filter((obj) => isNotEmpty(obj[1]))
            .map((obj) => {
                return `filter_${obj[0]}=${obj[1]}`;
            })
            .join("&")
        : "";

    return [pagination, sort, search, filter]
        .filter((f) => f)
        .join("&");
}

// Link: https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
function paginate(
    currentPage: number = 1,
    totalPages: number,
    // totalItems: number,
    // pageSize: number = 10,
    maxPages: number = 5,
) {
    // calculate total pages
    // const totalPages = totalPageNumber && Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1)
        currentPage = 1;
    else if (currentPage > totalPages)
        currentPage = totalPages;


    let startPage: number, endPage: number;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    // const startIndex = (currentPage - 1) * pageSize;
    // const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        // totalItems: totalItems,
        currentPage: currentPage,
        // pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        // startIndex: startIndex,
        // endIndex: endIndex,
        pages: pages
    };
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}

export {
    isNotEmpty,
    stringifyRequestQuery,
    paginate,
    useDebounce
};
