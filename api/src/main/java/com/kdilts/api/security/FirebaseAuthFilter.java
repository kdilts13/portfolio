package com.kdilts.api.security;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
            String uid = decoded.getUid();
            String email = decoded.getEmail();

            // --- Fetch or create user doc in Firestore ---
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference userRef = db.collection("users").document(uid);
            DocumentSnapshot snap = userRef.get().get();  // blocking but fine for now

            boolean approved = false;

            if (!snap.exists()) {
                // New user: create a pending record
                Map<String, Object> data = Map.of(
                    "email", email,
                    "approved", false,
                    "createdAt", Timestamp.now(),
                    "updatedAt", Timestamp.now()
                );
                userRef.set(data).get();
                log.info("Created pending user record for uid={} email={}", uid, email);
            } else {
                Object value = snap.get("approved");
                if (value instanceof Boolean b) {
                    approved = b;
                }
            }

            // --- Build authorities ---
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            if (approved) {
                authorities.add(new SimpleGrantedAuthority("ROLE_APPROVED"));
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    decoded, // principal
                    null,    // credentials
                    authorities
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Optionally attach uid for controllers
            request.setAttribute("firebaseUid", uid);

            if (!approved) {
                log.warn("User uid={} email={} is not approved", uid, email);
            }

            filterChain.doFilter(request, response);
        } catch (FirebaseAuthException e) {
            log.warn("Firebase token verification failed on {}: {}", path, e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (Exception e) {
            log.error("Unexpected error in FirebaseAuthFilter on {}", path, e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
