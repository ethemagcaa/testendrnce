# Build stage
FROM maven:3.8.5-openjdk-17-slim AS build

COPY pom.xml /app/

# download all the dependencies required by the application
RUN mvn -f /app/pom.xml dependency:go-offline

COPY src /app/src

# RUN mvn -q -f /app/pom.xml test

RUN mvn -f /app/pom.xml -DskipTests package

# Run stage
FROM openjdk:17-jdk-slim-buster

ARG SPRING_DATASOURCE_URL
ARG SPRING_DATASOURCE_USERNAME
ARG SPRING_DATASOURCE_PASSWORD

ENV SPRING_DATASOURCE_URL="$SPRING_DATASOURCE_URL"
ENV SPRING_DATASOURCE_USERNAME="$SPRING_DATASOURCE_USERNAME"
ENV SPRING_DATASOURCE_PASSWORD="$SPRING_DATASOURCE_PASSWORD"

ENV SPRING_PROFILES_ACTIVE=production
ENV PORT="8001"

LABEL maintainer="Enes Pekkaya <enespekkaya@jotform.com>"
LABEL version="1.0"
LABEL description="Endrnce Service"

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl

HEALTHCHECK --start-period=5s --interval=10s --timeout=3s --retries=3 \
            CMD curl --silent --fail --user 'actuator:Sy!v25N.14mbc' http://localhost:${PORT}/actuator/health/liveness \
            || exit 1

COPY --from=build /app/target/endrnce*.jar /app/app.jar

EXPOSE ${PORT}

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","-Dserver.port=${PORT}","/app/app.jar"]