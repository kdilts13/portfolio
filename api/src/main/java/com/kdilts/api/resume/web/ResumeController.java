package com.kdilts.api.resume.web;

import com.kdilts.api.ai.config.AiProperties;
import com.kdilts.api.resume.PdfResumeExtractor;
import com.kdilts.api.resume.config.ResumeProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

record ResumeExtractResponse(String text) {}
record ErrorResponse(String error, String message) {}

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final AiProperties aiProps;
    private final ResumeProperties resumeProps;
    private final PdfResumeExtractor extractor;

    public ResumeController(AiProperties aiProps, ResumeProperties resumeProps, PdfResumeExtractor extractor) {
        this.aiProps = aiProps;
        this.resumeProps = resumeProps;
        this.extractor = extractor;
    }

    @PostMapping(
        value = "/extract",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> extractPdf(
        @RequestPart("file") MultipartFile file,
        HttpServletRequest request
    ) {
        if (!aiProps.enabled()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("FEATURE_DISABLED", "AI tools are not enabled"));
        }

        String uid = (String) request.getAttribute("firebaseUid");
        if (uid == null || uid.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("UNAUTHENTICATED", "Missing user identity"));
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("INVALID_FILE", "No file provided"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("INVALID_FILE_TYPE", "Only PDF files are supported in v1"));
        }

        long maxBytes = resumeProps.maxPdfBytes();
        if (file.getSize() > maxBytes) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(new ErrorResponse("FILE_TOO_LARGE", "PDF exceeds max allowed size"));
        }

        try {
            String text = extractor.extractText(file.getInputStream());
            return ResponseEntity.ok(new ResumeExtractResponse(text));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("EXTRACTION_FAILED", "Could not extract text from PDF"));
        }
    }
}
