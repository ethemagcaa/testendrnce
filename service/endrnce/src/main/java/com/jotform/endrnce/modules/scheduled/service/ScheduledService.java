package com.jotform.endrnce.modules.scheduled.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.modules.healthcheck.service.HealthCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Slf4j
@RequiredArgsConstructor
@Service
public class ScheduledService {

    private final HealthCheckService healthCheckService;

    public void callEndPointOfVendors() throws JsonProcessingException, ParseException {
        healthCheckService.callEndPointOfVendors();
    }
}
