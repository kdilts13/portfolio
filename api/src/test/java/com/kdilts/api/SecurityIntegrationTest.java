package com.kdilts.api;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import com.kdilts.api.config.FirebaseAdminConfig;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc  // full context + real security filter chain
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // This replaces the real FirebaseAdminConfig with a Mockito mock for this test context.
    @TestConfiguration
    static class OverrideConfig {

        @Bean
        FirebaseAdminConfig firebaseAdminConfig() {
            return Mockito.mock(FirebaseAdminConfig.class);
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
