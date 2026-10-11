package com.sms.config;

import com.sms.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth

                        // Public APIs
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/testing").permitAll()


                        // =========================
                        // USER MODULE
                        // =========================

                        .requestMatchers("/api/users/**")
                        .hasRole("SUPER_ADMIN")


                        // Student self profile
                        .requestMatchers(HttpMethod.GET, "/api/students/me").hasRole("STUDENT")

                        // =========================
                        // STUDENT MODULE
                        // =========================

                        // Create Student
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/students/**"
                        )
                        .hasRole("SUPER_ADMIN")

                        // View Students
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/students/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Update Student
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/students/**"
                        )
                        .hasRole("SUPER_ADMIN")

                        // Delete Student
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/students/**"
                        )
                        .hasRole("SUPER_ADMIN")


                        // =========================
                        // TEACHER MODULE
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/teachers/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        .requestMatchers("/api/teachers/**")
                        .hasRole("SUPER_ADMIN")


                        // =========================
                        // COURSE MODULE
                        // =========================

                        // View Courses
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/courses/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER",
                                "STUDENT"
                        )

                        // Create / Update / Delete Course
                        .requestMatchers("/api/courses/**")
                        .hasRole("SUPER_ADMIN")


                        // Student self attendance
                        .requestMatchers(HttpMethod.GET, "/api/attendance/me").hasRole("STUDENT")

                        // =========================
                        // ATTENDANCE MODULE
                        // =========================

                        // View Attendance
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attendance/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Create Attendance
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/attendance/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Update Attendance
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/attendance/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Delete Attendance
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/attendance/**"
                        )
                        .hasRole("SUPER_ADMIN")


                        // Student self marks
                        .requestMatchers(HttpMethod.GET, "/api/marks/me").hasRole("STUDENT")

                        // =========================
                        // MARKS MODULE
                        // =========================

                        // View Marks
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/marks/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Create Marks
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/marks/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Update Marks
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/marks/**"
                        )
                        .hasAnyRole(
                                "SUPER_ADMIN",
                                "TEACHER"
                        )

                        // Delete Marks
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/marks/**"
                        )
                        .hasRole("SUPER_ADMIN")


                        // Everything else requires login
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
