package com.jotform.endrnce.common.payload.response;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class QueryResponse<T> {

    private T data;
    private int pageCount;
    private int totalRows;
}
