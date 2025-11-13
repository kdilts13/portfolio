package com.kdilts.api.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Public endpoints
        return path.startsWith("/api/hello")
                || path.startsWith("/api/info")
                || path.startsWith("/api/me")
                || path.startsWith("/actuator")
                || path.equals("/")
                || path.startsWith("/error");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header on {}", path);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String idToken = authHeader.substring("Bearer ".length());

        try {
            FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);

            // For debugging – you already saw this working
            log.warn(">>> decoded.getUid(): {}", decoded.getUid());

            // Create an Authentication and put it into the SecurityContext
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
            var authentication = new UsernamePasswordAuthenticationToken(
                    decoded, // principal (could also use decoded.getUid())
                    null,    // credentials
                    authorities
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Optionally attach uid as a request attribute too
            request.setAttribute("firebaseUid", decoded.getUid());

            filterChain.doFilter(request, response);
        } catch (FirebaseAuthException e) {
            log.warn("Firebase token verification failed on {}: {}", path, e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
