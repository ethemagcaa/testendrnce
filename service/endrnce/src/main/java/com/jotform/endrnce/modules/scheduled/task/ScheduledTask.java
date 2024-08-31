package com.jotform.endrnce.modules.scheduled.task;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.modules.scheduled.service.ScheduledService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
@Component
public class ScheduledTask {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM YYYY HH:mm:ss");

    private final ScheduledService scheduledService;

    @Scheduled(cron = "0 */1 * * * *")
    public void cronHealthCheckEndpoints() throws JsonProcessingException, ParseException {
        log.info("Scheduled Time is now : {}", dateFormat.format(new Date()));
        scheduledService.callEndPointOfVendors();
    }
}
