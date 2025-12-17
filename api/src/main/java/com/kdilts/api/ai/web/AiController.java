package com.kdilts.api.ai.web;

import com.kdilts.api.ai.config.AiProperties;
import com.kdilts.api.ai.config.OpenAiProperties;
import com.kdilts.api.ai.openai.OpenAiStreamingClient;
import com.kdilts.api.ai.prompt.AiPromptBuilder;
import com.kdilts.api.ai.usage.AiUsageService;
import com.kdilts.api.ai.usage.DailyLimitExceededException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletResponse;

record AiEvaluateRequest(String tool, String resumeText, String jobDescription) {}
record ErrorResponse(String error, String message) {}

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    private final AiProperties aiProps;
    private final OpenAiProperties openAiProps;
    private final AiUsageService usageService;
    private final AiPromptBuilder promptBuilder;
    private final OpenAiStreamingClient openAi;

    public AiController(
        AiProperties aiProps,
        OpenAiProperties openAiProps,
        AiUsageService usageService,
        AiPromptBuilder promptBuilder,
        OpenAiStreamingClient openAi
    ) {
        this.aiProps = aiProps;
        this.openAiProps = openAiProps;
        this.usageService = usageService;
        this.promptBuilder = promptBuilder;
        this.openAi = openAi;
    }

    @PostMapping("/evaluate")
    public Object evaluate(@RequestBody AiEvaluateRequest body, HttpServletRequest request, HttpServletResponse response) {
        if (!aiProps.enabled()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("FEATURE_DISABLED", "AI tools are not enabled"));
        }

        String uid = (String) request.getAttribute("firebaseUid");
        if (uid == null || uid.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("UNAUTHENTICATED", "Missing user identity"));
        }

        if (body == null || body.tool() == null || body.resumeText() == null || body.jobDescription() == null) {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("INVALID_REQUEST", "tool, resumeText, and jobDescription are required"));
        }

        AiPromptBuilder.Tool tool;
        String toolRaw = body.tool().trim();
        if (toolRaw.equalsIgnoreCase("resume_tailor")) tool = AiPromptBuilder.Tool.RESUME_TAILOR;
        else if (toolRaw.equalsIgnoreCase("job_fit")) tool = AiPromptBuilder.Tool.JOB_FIT;
        else {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("INVALID_TOOL", "tool must be resume_tailor or job_fit"));
        }

        if (body.resumeText().length() > aiProps.maxResumeChars()) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("RESUME_TOO_LARGE", "resumeText exceeds max chars"));
        }
        if (body.jobDescription().length() > aiProps.maxJobDescChars()) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("JOB_DESC_TOO_LARGE", "jobDescription exceeds max chars"));
        }

        try {
            usageService.incrementDailyRunsOrThrow(uid);
        } catch (DailyLimitExceededException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse("DAILY_LIMIT_EXCEEDED", "Daily limit reached (" + e.getLimit() + "/day). Try again tomorrow."));
        }

        String input = promptBuilder.buildInput(tool, body.resumeText(), body.jobDescription());

        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.TEXT_PLAIN_VALUE);

        StreamingResponseBody stream = outputStream -> {
            try {
                String model = (openAiProps.model() != null && !openAiProps.model().isBlank())
                    ? openAiProps.model()
                    : "gpt-4.1-mini";
                openAi.streamText(model, input, aiProps.maxOutputTokens(), outputStream);
            } catch (Exception e) {
                log.error("AI evaluate failed (uid={})", uid, e);
                String msg = "\n\n[Error generating response. Please try again later.]";
                outputStream.write(msg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                outputStream.flush();
            }
        };

        return stream;
    }
}
