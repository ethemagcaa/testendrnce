package com.jotform.endrnce.modules.healthcheck.service.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotform.endrnce.common.util.RandomGenerator;
import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckActiveEndPointDTO;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEnvironment;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckEnvironmentRepository;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RequiredArgsConstructor
public class SendRequestVendorHelper {

    private final HealthCheckEnvironmentRepository healthCheckEnvironmentRepository;

    public Map<String, String> parseJsonHeader(String jsonHeader) throws JsonProcessingException {
        if (jsonHeader == null) {
            return Collections.emptyMap();
        }

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonHeader.replaceAll("\\n", ""), new TypeReference<HashMap<String, String>>() {});
    }

    public String replaceDynamicData(HealthCheckActiveEndPointDTO endPointDTO, String text) {
        text = this.replaceEnvironment(endPointDTO, text);
        text = this.replaceRandomNumbers(text);

        return text;
    }

    private String replaceEnvironment(HealthCheckActiveEndPointDTO endPointDTO, String text) {
        List<HealthCheckEnvironment> healthCheckVendorList = healthCheckEnvironmentRepository.findByHealthCheckVendorId(endPointDTO.getVendorId());

        for(HealthCheckEnvironment environment : healthCheckVendorList) {
            text = text.replaceAll(Pattern.quote(String.format("{{%s}}", environment.getEnvironmentKey())), environment.getEnvironmentValue());
        }

        return text;
    }

    private String replaceRandomNumbers(String text) {
        Pattern pattern = Pattern.compile("\\{\\{randomNumber:(\\d+)\\}\\}");
        Matcher matcher = pattern.matcher(text);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            int length = Integer.parseInt(matcher.group(1));
            String randomNumber = String.valueOf(RandomGenerator.generateRandomNumber(length));
            matcher.appendReplacement(sb, randomNumber);
        }
        matcher.appendTail(sb);

        return sb.toString();
    }
}
