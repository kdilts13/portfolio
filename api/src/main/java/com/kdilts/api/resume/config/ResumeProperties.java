package com.kdilts.api.resume.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.resume")
public record ResumeProperties(
    long maxPdfBytes
) {}
