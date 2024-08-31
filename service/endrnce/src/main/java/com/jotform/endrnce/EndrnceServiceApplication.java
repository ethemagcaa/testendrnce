package com.jotform.endrnce;

import com.jotform.endrnce.config.AppProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(AppProperties.class)
public class EndrnceServiceApplication {

	@Value("${app.timezone:UTC}")
	private String applicationTimeZone;

	public static void main(String[] args) {
		SpringApplication.run(EndrnceServiceApplication.class, args);
	}

	@PostConstruct
	public void init(){
		// Setting Spring Boot SetTimeZone
		TimeZone.setDefault(TimeZone.getTimeZone(applicationTimeZone));
	}
}
