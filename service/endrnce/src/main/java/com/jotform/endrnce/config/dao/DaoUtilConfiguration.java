package com.jotform.endrnce.config.dao;

import com.jotform.endrnce.common.util.DaoUtil;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;

@Slf4j
@Component
@Lazy(false)
public class DaoUtilConfiguration {

    @PostConstruct
    public void init() {
        log.info("initializing DaoUtil via loading sql_queries.xml");

        try {
            DaoUtil.initializeAllQueries();
        } catch (IOException | ParserConfigurationException | SAXException e) {
            throw new RuntimeException("Could not read sql_queries.xml file...", e);
        }
    }
}
