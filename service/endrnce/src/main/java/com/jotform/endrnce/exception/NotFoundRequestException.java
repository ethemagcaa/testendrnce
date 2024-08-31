package com.jotform.endrnce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundRequestException extends RuntimeException {
    public NotFoundRequestException(String message) {
        super(message);
    }

    public NotFoundRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
