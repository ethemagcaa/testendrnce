package com.jotform.endrnce.common.httpclient;

import com.jotform.endrnce.common.httpclient.enums.RequestSenderTypeEnum;
import com.jotform.endrnce.common.httpclient.model.HttpModel;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.config.RestAssuredConfig;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.listener.ResponseValidationFailureListener;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;

import java.io.File;

import static io.restassured.config.FailureConfig.failureConfig;
import static io.restassured.config.LogConfig.logConfig;
import static io.restassured.config.RedirectConfig.redirectConfig;

@Slf4j
@Getter
@Setter
public abstract class HttpClient {

    public HttpClient() {
        RestAssured.config = getDefaultConfig();
    }

    public RestAssuredConfig getDefaultConfig() {
        ResponseValidationFailureListener failureListener = (reqSpec, resSpec, response) ->
            System.out.printf(
                "We have a failure, " + "response status was %s and the body contained: %s",
                response.getStatusCode(),
                response.body().prettyPrint()
            );

        return RestAssured
            .config()
            .logConfig(logConfig().enableLoggingOfRequestAndResponseIfValidationFails(LogDetail.ALL).enablePrettyPrinting(true))
            .failureConfig(failureConfig().failureListeners(failureListener))
            .redirect(redirectConfig().maxRedirects(1));
    }

    public Response get(HttpModel httpModel) {
        httpModel.setRequestSenderTypeEnum(RequestSenderTypeEnum.GET);

        return request(httpModel);
    }

    public Response post(HttpModel httpModel) {
        httpModel.setRequestSenderTypeEnum(RequestSenderTypeEnum.POST);

        return request(httpModel);
    }

    public Response put(HttpModel httpModel) {
        httpModel.setRequestSenderTypeEnum(RequestSenderTypeEnum.PUT);

        return request(httpModel);
    }

    public Response delete(HttpModel httpModel) {
        httpModel.setRequestSenderTypeEnum(RequestSenderTypeEnum.DELETE);

        return request(httpModel);
    }

    public Response request(HttpModel httpModel) {
        RequestSpecification httpRequest = RestAssured.given();

        if (httpModel.getRequestIsLogged()) {
            httpRequest.log().all();
        }

        String baseUri = httpModel.getRequestBaseUri();

        if (!ObjectUtils.isEmpty(httpModel.getRequestMultipart())) {
            httpRequest.spec(getRequestTypeMultipart(baseUri));
            for (String key : httpModel.getRequestMultipart().keySet()) {
                httpRequest.multiPart(key, new File(httpModel.getRequestMultipart().get(key)), "application/pdf");
            }
        } else if (!ObjectUtils.isEmpty(httpModel.getRequestBody())) {
            httpRequest.spec(getRequestTypeJson(baseUri));
        } else {
            httpRequest.spec(getRequestTypeURLENC(baseUri));
        }

        if (!ObjectUtils.isEmpty(httpModel.getRequestCookies())) {
            httpRequest.cookies(httpModel.getRequestCookies());
        }

        if (!ObjectUtils.isEmpty(httpModel.getRequestParams())) {
            httpRequest.params(httpModel.getRequestParams());
        }
        if (!ObjectUtils.isEmpty(httpModel.getRequestQueryParams())) {
            httpRequest.queryParams(httpModel.getRequestQueryParams());
        }

        if (!ObjectUtils.isEmpty(httpModel.getRequestHeaders())) {
            httpRequest.headers(httpModel.getRequestHeaders());
        }

        if (!ObjectUtils.isEmpty(httpModel.getRequestFormParams())) {
            httpRequest.formParams(httpModel.getRequestFormParams());
        }

        if (!ObjectUtils.isEmpty(httpModel.getRequestBody())) {
            httpRequest.body(httpModel.getRequestBody());
        }

        return getHttpRequestSenderFactory(httpModel, httpRequest);
    }

    private Response getHttpRequestSenderFactory(HttpModel httpModel, RequestSpecification httpRequest) {
        return switch (httpModel.getRequestSenderTypeEnum()) {
            case GET -> httpRequest.get(httpModel.getRequestPath());
            case POST -> httpRequest.post(httpModel.getRequestPath());
            case DELETE -> httpRequest.delete(httpModel.getRequestPath());
            case PUT -> httpRequest.put(httpModel.getRequestPath());
        };
    }

    public RequestSpecification getRequestTypeURLENC(String baseUri) {
        return new RequestSpecBuilder()
            .setContentType(ContentType.URLENC)
            .setAccept(ContentType.ANY)
            .setBaseUri(baseUri)
            .build();
    }

    public RequestSpecification getRequestTypeJson(String baseUri) {
        return new RequestSpecBuilder()
            .setContentType(ContentType.JSON)
            .setAccept(ContentType.ANY)
            .setBaseUri(baseUri)
            .build();
    }

    public RequestSpecification getRequestTypeMultipart(String baseUri) {
        return new RequestSpecBuilder()
            .setContentType(ContentType.MULTIPART)
            .setAccept(ContentType.ANY)
            .setBaseUri(baseUri)
            .build();
    }
}
