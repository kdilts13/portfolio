package com.kdilts.api.ai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.ai")
public record AiProperties(
    boolean enabled,
    int dailyRunLimitDefault,
    int maxResumeChars,
    int maxJobDescChars,
    int maxOutputTokens,
    List<String> unlimitedUids
) {}
