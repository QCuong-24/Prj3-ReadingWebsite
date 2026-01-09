FROM mcr.microsoft.com/playwright/java:v1.49.0-noble

WORKDIR /app

COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src ./src

EXPOSE 8088

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

CMD ["mvn", "-q", "-B", "spring-boot:run"]