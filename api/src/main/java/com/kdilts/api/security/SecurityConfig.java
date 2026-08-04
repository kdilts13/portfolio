package com.kdilts.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.DispatcherType;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            FirebaseAuthFilter firebaseAuthFilter
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                // .requestMatchers().permitAll()

                // Endpoints that require *approved* users
                // .requestMatchers().hasRole("APPROVED")
            .dispatcherTypeMatchers(
                DispatcherType.ASYNC,
                DispatcherType.ERROR
            ).permitAll()

            .requestMatchers("/actuator/health").permitAll()

            .requestMatchers("/api/me").authenticated()
            .requestMatchers("/api/ai/**").authenticated()
            .requestMatchers("/api/**").authenticated()

            // Reject actuator requests
            .requestMatchers("/actuator/**").denyAll()

            // Everything else (non-API) is public
            .anyRequest().permitAll()
            )
            .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
