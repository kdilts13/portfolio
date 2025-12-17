package com.kdilts.api.ai.openai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdilts.api.ai.config.OpenAiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

@Component
public class OpenAiStreamingClient {

    private static final Logger log = LoggerFactory.getLogger(OpenAiStreamingClient.class);
    private static final URI RESPONSES_URI = URI.create("https://api.openai.com/v1/responses");

    private final OpenAiProperties props;
    private final ObjectMapper objectMapper;
    private final HttpClient http;

    public OpenAiStreamingClient(OpenAiProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
        this.http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    }

    /** Calls OpenAI Responses API with stream=true and writes only the text deltas to OutputStream. */
    public void streamText(String model, String input, int maxOutputTokens, OutputStream out) throws Exception {
        String apiKey = props.apiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OpenAI api key is not configured (app.openai.api-key)");
        }

        Map<String, Object> body = Map.of(
            "model", model,
            "stream", true,
            "max_output_tokens", maxOutputTokens,
            "input", input
        );
        String json = objectMapper.writeValueAsString(body);

        HttpRequest req = HttpRequest.newBuilder()
            .uri(RESPONSES_URI)
            .timeout(Duration.ofMinutes(2))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
            .build();

        HttpResponse<InputStream> resp = http.send(req, HttpResponse.BodyHandlers.ofInputStream());
        int status = resp.statusCode();
        if (status < 200 || status >= 300) {
            String err = new String(resp.body().readAllBytes(), StandardCharsets.UTF_8);
            log.warn("OpenAI non-2xx status {} body={}", status, truncate(err, 500));
            throw new RuntimeException("OpenAI request failed with status " + status);
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resp.body(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;

                // Event-stream framing often uses "data: <json>" lines
                if (line.startsWith("data:")) line = line.substring("data:".length()).trim();
                if (line.equals("[DONE]")) break;

                JsonNode event;
                try {
                    event = objectMapper.readTree(line);
                } catch (Exception parse) {
                    log.debug("Skipping non-JSON stream line: {}", truncate(line, 200));
                    continue;
                }

                String type = event.path("type").asText("");
                if ("response.output_text.delta".equals(type)) {
                    String delta = event.path("delta").asText("");
                    if (!delta.isEmpty()) {
                        out.write(delta.getBytes(StandardCharsets.UTF_8));
                        out.flush();
                    }
                }
            }
        }
    }

    private static String truncate(String s, int max) {
        if (s == null) return "";
        if (s.length() <= max) return s;
        return s.substring(0, max) + "...";
    }
}
