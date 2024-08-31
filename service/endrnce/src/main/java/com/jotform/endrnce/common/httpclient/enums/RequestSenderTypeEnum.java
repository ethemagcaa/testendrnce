package com.jotform.endrnce.common.httpclient.enums;

public enum RequestSenderTypeEnum {
    GET(1L),
    POST(2L),
    PUT(3L),
    DELETE(4L);

    private Long id;

    RequestSenderTypeEnum(Long id) {
        this.id = id;
    }

    public static RequestSenderTypeEnum getById(Long id) {
        if (id != null && id != 0) {
            for (RequestSenderTypeEnum requestSenderTypeEnum : RequestSenderTypeEnum.values()) {
                if (requestSenderTypeEnum.getId().equals(id)) {
                    return requestSenderTypeEnum;
                }
            }
        }
        return null;
    }

    public Long getId() {
        return id;
    }
}
