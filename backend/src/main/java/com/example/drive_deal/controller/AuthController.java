package com.example.drive_deal.controller;

import com.example.drive_deal.dto.AuthRequest;
import com.example.drive_deal.dto.AuthResponse;
import com.example.drive_deal.entity.Role;
import com.example.drive_deal.entity.User;
import com.example.drive_deal.repository.UserRepository;
import com.example.drive_deal.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    try {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "Email ou mot de passe incorrect",
                            "message", "Aucun compte trouvé avec cet email"
                    ));
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String jwt = jwtService.generateToken(user);

        // 🔹 IDs demandés
        Long userId = user.getId();
        Long clientId = user.getClient() != null
                ? user.getClient().getId()
                : null;

        return ResponseEntity.ok(
                new AuthResponse(
                        jwt,
                        userId,
                        clientId,
                        user.getRole().name(),
                        "Connexion réussie"
                )
        );

    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "Email ou mot de passe incorrect",
                        "message", "Mot de passe incorrect"
                ));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Erreur lors de la connexion",
                        "message", e.getMessage()
                ));
    }
}
    // Endpoint pour créer un admin (à utiliser une seule fois ou sécuriser)
    @PostMapping("/register-admin")
    public ResponseEntity<String> registerAdmin() {
        String adminEmail = "admin@drivedreal.com";
        String adminPassword = "admin123"; // Mot de passe par défaut en minuscules
        
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return ResponseEntity.badRequest().body("Admin existe déjà. Utilisez /api/auth/reset-admin-password pour réinitialiser le mot de passe.");
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .firstName("Admin")
                .lastName("System")
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        return ResponseEntity.ok("Admin créé avec succès. Email: " + adminEmail + ", Password: " + adminPassword);
    }

    // Endpoint pour réinitialiser le mot de passe de l'admin
    @PostMapping("/reset-admin-password")
    public ResponseEntity<String> resetAdminPassword() {
        String adminEmail = "admin@drivedreal.com";
        String newPassword = "admin123"; // Réinitialiser à admin123
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé. Créez d'abord l'admin avec /api/auth/register-admin"));

        // Mettre à jour le mot de passe
        admin.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(admin);
        
        return ResponseEntity.ok("Mot de passe admin réinitialisé. Nouveau mot de passe: " + newPassword);
    }
    @PostMapping("/register-client")
    public ResponseEntity<String> registerClient(@RequestBody AuthRequest request) {
        System.out.println("Requête reçue : " + request);
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Client existe déjà");
        }

        User client = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.CLIENT)
                .build();

        userRepository.save(client);
        System.out.println("Client créé : " + client.getEmail());
        return ResponseEntity.ok("Client créé avec succès");
    }


}