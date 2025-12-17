package com.kdilts.api.resume;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class PdfResumeExtractor {

    public String extractText(InputStream pdfStream) throws Exception {
        try (PDDocument doc = PDDocument.load(pdfStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);

            // Normalize line endings + trim trailing whitespace
            text = text.replace("\r\n", "\n").replace("\r", "\n");
            return text.trim();
        }
    }
}
