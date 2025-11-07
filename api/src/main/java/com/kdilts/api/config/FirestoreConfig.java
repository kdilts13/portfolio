package com.kdilts.api.config;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirestoreConfig {
  @Bean
  public Firestore firestore() {
    // If FIRESTORE_EMULATOR_HOST is set, FirestoreOptions will use it automatically.
    return FirestoreOptions.getDefaultInstance().getService();
  }
}
