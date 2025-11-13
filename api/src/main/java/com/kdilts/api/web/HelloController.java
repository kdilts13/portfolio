package com.kdilts.api.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.Instant;
import java.util.Map;

record MeResponse(
    String uid,
    String email,
    boolean approved
) {}

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
    public ResponseEntity<MeResponse> me(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String uid = (String) request.getAttribute("firebaseUid");
        String email = (String) request.getAttribute("firebaseEmail");
        Boolean approved = (Boolean) request.getAttribute("firebaseApproved");
        if (approved == null) {
            approved = false;
        }

        return ResponseEntity.ok(new MeResponse(uid, email, approved));
    }
}
