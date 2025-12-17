package com.kdilts.api.ai.prompt;

import org.springframework.stereotype.Component;

@Component
public class AiPromptBuilder {

    public enum Tool {
        RESUME_TAILOR,
        JOB_FIT
    }

    public String buildInput(Tool tool, String resumeText, String jobDescription) {
        // v1: minimal templates. You'll replace these with your Custom GPT prompts later.
        return switch (tool) {
            case RESUME_TAILOR -> "You are a helpful assistant that tailors a resume to a job description.\n\n" +
                "Return ONLY markdown text.\n\n" +
                "## Job Description\n" + jobDescription + "\n\n" +
                "## Resume\n" + resumeText + "\n\n" +
                "## Task\n" +
                "Suggest concrete edits to tailor the resume to the job. Focus on impact, relevance, and keywords.\n";
            case JOB_FIT -> "You are a helpful assistant that evaluates job fit based on a resume and job description.\n\n" +
                "Return ONLY markdown text.\n\n" +
                "## Job Description\n" + jobDescription + "\n\n" +
                "## Resume\n" + resumeText + "\n\n" +
                "## Task\n" +
                "Assess strengths, gaps, and suggested next steps. Include a brief overall fit summary.\n";
        };
    }
}
