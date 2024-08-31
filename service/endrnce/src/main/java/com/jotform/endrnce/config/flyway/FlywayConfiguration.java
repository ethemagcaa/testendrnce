package com.jotform.endrnce.config.flyway;

import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class FlywayConfiguration implements FlywayConfigurationCustomizer {

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private void setDataSource(final DataSource dataSource) {
        namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    @Override
    public void customize(FluentConfiguration configuration) {
        configuration
                .encoding("UTF-8")
                .baselineOnMigrate(true)
                .outOfOrder(true)
                .locations("classpath:db/migration")
                .dataSource(namedParameterJdbcTemplate.getJdbcTemplate().getDataSource())
                .table("flyway")
                .sqlMigrationPrefix("V")
                .sqlMigrationSuffixes(".sql")
                .load();
    }
}
