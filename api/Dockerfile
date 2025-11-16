FROM eclipse-temurin:21-jre

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
WORKDIR /app

# copy the prebuilt jar from CI
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
