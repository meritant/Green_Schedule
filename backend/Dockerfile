FROM --platform=linux/amd64 amazoncorretto:17-alpine
VOLUME /tmp
COPY target/*.jar schedule.jar
ENTRYPOINT ["java","-jar","/schedule.jar"]
ENV JAVA_OPTS="-Xmx128m -Xms64m"