package com.jotform.endrnce.common.httpclient.model;

import com.jotform.endrnce.common.httpclient.enums.RequestSenderTypeEnum;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class HttpModel {

    private String jobName;
    private String requestBaseUri;
    private String requestPath;
    private Map<String, Object> requestParams;
    private Map<String, String> requestHeaders;
    private Map<String, Object> requestFormParams;
    private Map<String, Object> requestQueryParams;
    private Object requestBody;
    private Map<String, String> requestMultipart;
    private Map<String, String> requestCookies;

    @Builder.Default
    private Boolean requestIsLogged = false;

    @Builder.Default
    private RequestSenderTypeEnum requestSenderTypeEnum = RequestSenderTypeEnum.GET;

    @Builder.Default
    private Boolean responseIsLogged = true;
}
