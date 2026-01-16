package com.example.drive_deal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration CORS pour autoriser les requêtes depuis le frontend
 * 
 * Cette configuration permet au frontend React (généralement sur http://localhost:5173)
 * de communiquer avec le backend Spring Boot sans erreurs CORS.
 */
@Configuration
public class CorsConfig {

    /**
     * Configuration de la source CORS
     * 
     * @return CorsConfigurationSource configuré pour accepter les requêtes du frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser les origines du frontend (tous les ports de développement courants)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite dev server (port par défaut)
            "http://localhost:8081",  // Vite dev server (port alternatif)
            "http://localhost:3000",  // React dev server
            "http://127.0.0.1:5173",  // Alternative localhost
            "http://127.0.0.1:8081",  // Alternative localhost
            "http://127.0.0.1:3000"   // Alternative localhost
        ));
        
        // Autoriser les méthodes HTTP nécessaires
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Autoriser les headers nécessaires (Authorization pour JWT, Content-Type pour JSON)
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Autoriser l'envoi de credentials (cookies, headers d'authentification)
        configuration.setAllowCredentials(true);
        
        // Exposer les headers personnalisés dans la réponse
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));
        
        // Durée de mise en cache de la configuration CORS (en secondes)
        configuration.setMaxAge(3600L);
        
        // Appliquer cette configuration à tous les endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
