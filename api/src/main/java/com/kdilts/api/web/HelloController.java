package com.kdilts.api.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot 👋";
    }

    // Optional: a simple JSON info endpoint (separate from Actuator /info)
    @GetMapping("/info")
    public Map<String, Object> info() {
        return Map.of(
                "service", "portfolio-api",
                "version", "1.0.0",
                "timestamp", Instant.now().toString()
        );
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
    return Map.of(
      "authenticated", auth != null && auth.isAuthenticated(),
      "principal", auth != null ? auth.getPrincipal() : null,
      "authorities", auth != null ? auth.getAuthorities() : null
    );
  }
}
