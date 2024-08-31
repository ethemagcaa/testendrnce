# ENDRNCE SERVICE

## UNIT TEST

To run unit testing, the following shell script is executed.

```bash
./mvnw clean test
```

### UNIT TEST REPORT

Getting reports from unit testing, we use allure report to achieve this.

#### PREREQUISITES

Installing below apps.

1. Java 17
2. Docker
3. [Allure Report][0]

#### GETTING UNIT TEST REPORT

The following shell script is executed;

```bash
allure serve allure-results
```

[0]: https://docs.qameta.io/allure/#_installing_a_commandline
