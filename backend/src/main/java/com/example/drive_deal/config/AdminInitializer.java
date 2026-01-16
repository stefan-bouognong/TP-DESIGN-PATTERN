package com.example.drive_deal.config;

import com.example.drive_deal.entity.Role;
import com.example.drive_deal.entity.User;
import com.example.drive_deal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initialiseur automatique du compte admin
 * 
 * Ce composant s'exécute au démarrage de l'application et crée automatiquement
 * le compte admin s'il n'existe pas déjà dans la base de données.
 * 
 * Cela évite d'avoir à appeler manuellement l'endpoint /api/auth/register-admin
 * à chaque fois que la base de données est réinitialisée.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Configuration du compte admin par défaut
    private static final String ADMIN_EMAIL = "admin@drivedreal.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_FIRST_NAME = "Admin";
    private static final String ADMIN_LAST_NAME = "System";

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si l'admin existe déjà
        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            log.info("✅ Compte admin déjà existant : {}", ADMIN_EMAIL);
            return;
        }

        // Créer le compte admin
        User admin = User.builder()
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .firstName(ADMIN_FIRST_NAME)
                .lastName(ADMIN_LAST_NAME)
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);

        log.info("✅ Compte admin créé automatiquement au démarrage");
        log.info("   Email: {}", ADMIN_EMAIL);
        log.info("   Password: {}", ADMIN_PASSWORD);
        log.info("   Role: {}", Role.ADMIN);
    }
}
