package com.kdilts.api.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

record MeResponse(
    String uid,
    String email,
    boolean approved
) {}

@RestController
@RequestMapping("/api")
public class ApiController {
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
