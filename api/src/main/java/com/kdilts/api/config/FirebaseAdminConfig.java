package com.kdilts.api.config;

import com.kdilts.api.security.FirebaseAuthFilter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Configuration
public class FirebaseAdminConfig {

    @PostConstruct
    public void init() throws IOException {
        // Avoid double init
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        Map<String, String> env = System.getenv();

        // Allow override in dev; default to prod project ID
        String projectId = env.getOrDefault("FIREBASE_PROJECT_ID", "kd-portfolio-prod");

        boolean usingAuthEmulator = env.containsKey("FIREBASE_AUTH_EMULATOR_HOST");

        FirebaseOptions.Builder builder = FirebaseOptions.builder()
                .setProjectId(projectId);

        if (usingAuthEmulator) {
            // When using the Auth emulator, we don't actually need real GCP creds.
            // Use a dummy AccessToken so we don't call ADC at all.
            GoogleCredentials fakeCreds = GoogleCredentials.create(
                    new AccessToken("owner", new Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(365)))
            );
            builder.setCredentials(fakeCreds);
        } else {
            // In Cloud Run / real env, use ADC
            builder.setCredentials(GoogleCredentials.getApplicationDefault());
        }

        FirebaseApp.initializeApp(builder.build());
    }
}
