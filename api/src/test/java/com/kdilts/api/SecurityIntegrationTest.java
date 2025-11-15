package com.kdilts.api;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import com.google.cloud.firestore.Firestore;
import com.kdilts.api.config.FirebaseAdminConfig;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.main.allow-bean-definition-overriding=true")
@AutoConfigureMockMvc  // full context + real security filter chain
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // This replaces the real FirebaseAdminConfig with a Mockito mock for this test context.
    @TestConfiguration
    static class OverrideConfig {

        @Bean
        FirebaseAdminConfig firebaseAdminConfig() {
            // Prevents ADC/Firebase init from running in tests
            return Mockito.mock(FirebaseAdminConfig.class);
        }

        @Bean
        Firestore firestore() {
            // Prevents FirestoreOptions.getDefaultInstance() from running in tests
            return Mockito.mock(Firestore.class);
        }
    }

    @Test
    void helloEndpointIsPublic() throws Exception {
        mockMvc.perform(get("/api/hello"))
                .andExpect(status().isOk());
    }

    @Test
    void meEndpointRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized());
    }
}
