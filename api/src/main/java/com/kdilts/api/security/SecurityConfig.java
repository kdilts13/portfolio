package com.kdilts.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable()) // API: bearer tokens, not cookies
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/actuator/**", "/api/hello", "/api/info").permitAll()
        .requestMatchers("/api/projects/**").authenticated()
        .anyRequest().permitAll()
      )
      .addFilterBefore(new FirebaseAuthFilter(), org.springframework.security.web.authentication.AnonymousAuthenticationFilter.class)
      .httpBasic(Customizer.withDefaults())
      .build();
  }
}
