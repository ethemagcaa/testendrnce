package com.jotform.endrnce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({NotFoundRequestException.class})
    public ResponseEntity<Object> handleNotFoundRequestException(NotFoundRequestException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.NOT_FOUND.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body);
    }

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<Object> handleBadRequestException(BadRequestException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.BAD_REQUEST.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.UNAUTHORIZED.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(body);
    }

    @ExceptionHandler({ForbiddenException.class})
    public ResponseEntity<Object> handleForbiddenException(ForbiddenException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.FORBIDDEN.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(body);
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.FORBIDDEN.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(body);
    }

    @ExceptionHandler({SQLIntegrityConstraintViolationException.class})
    public ResponseEntity<Object> handleAccessDeniedException(SQLIntegrityConstraintViolationException exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.CONFLICT.value());
        body.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(body);
    }
}
