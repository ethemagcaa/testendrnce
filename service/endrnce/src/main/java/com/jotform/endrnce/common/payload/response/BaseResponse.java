package com.jotform.endrnce.common.payload.response;

public class BaseResponse {

    public int responseCode;
    public String message;

    public BaseResponse(int status, String message) {
        this.responseCode = status;
        this.message = message;
    }
}
