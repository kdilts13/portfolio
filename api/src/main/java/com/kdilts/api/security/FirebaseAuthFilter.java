package com.kdilts.api.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class FirebaseAuthFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String authz = req.getHeader("Authorization");
    if (authz != null && authz.startsWith("Bearer ")) {
      String idToken = authz.substring(7);
      try {
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
        var auth = new FirebaseAuthentication(decoded);
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (Exception e) {
        res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid ID token");
        return;
      }
    }
    chain.doFilter(req, res);
  }

  static class FirebaseAuthentication extends AbstractAuthenticationToken {
    private final FirebaseToken token;

    FirebaseAuthentication(FirebaseToken token) {
      super(buildAuthorities(token));
      this.token = token;
      setAuthenticated(true);
    }

    @Override public Object getCredentials() { return token; }
    @Override public Object getPrincipal() { return token.getUid(); }

    private static List<SimpleGrantedAuthority> buildAuthorities(FirebaseToken token) {
      // Example: map custom claims → roles here if you add them
      return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
  }
}
