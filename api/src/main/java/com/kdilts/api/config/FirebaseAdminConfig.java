package com.kdilts.api.config;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseAdminConfig {

  @PostConstruct
  public void init() throws Exception {
    if (!FirebaseApp.getApps().isEmpty()) return;

    String projectId = System.getenv().getOrDefault("GOOGLE_CLOUD_PROJECT", "portfolio-dev");
    String authEmu = System.getenv("FIREBASE_AUTH_EMULATOR_HOST"); // e.g. 127.0.0.1:9099

    FirebaseOptions.Builder builder = FirebaseOptions.builder().setProjectId(projectId);

    if (authEmu != null && !authEmu.isBlank()) {
      // Emulator mode: provide a dummy credential to satisfy Admin SDK
      builder.setCredentials(GoogleCredentials.create(new AccessToken("owner", null)));
    } else {
      // Real env: use Application Default Credentials (service account, etc.)
      builder.setCredentials(GoogleCredentials.getApplicationDefault());
    }

    FirebaseApp.initializeApp(builder.build());
  }
}
