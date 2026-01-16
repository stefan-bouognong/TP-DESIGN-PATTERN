// DocumentBundleController.java (CORRIGÉ)
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.CreateBundleRequestDTO;
import com.example.drive_deal.dto.DocumentBundleResponseDTO;
import com.example.drive_deal.service.DocumentBundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/document-bundles")
@RequiredArgsConstructor
public class DocumentBundleController {
    
    private final DocumentBundleService bundleService;
    
    @PostMapping("/complete")
    public ResponseEntity<DocumentBundleResponseDTO> createCompleteBundle(
            @Valid @RequestBody CreateBundleRequestDTO request) {
        DocumentBundleResponseDTO response = bundleService.createCompleteBundle(request.getOrderId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/minimal")
    public ResponseEntity<DocumentBundleResponseDTO> createMinimalBundle(
            @Valid @RequestBody CreateBundleRequestDTO request) {
        DocumentBundleResponseDTO response = bundleService.createMinimalBundle(request.getOrderId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/registration")
    public ResponseEntity<DocumentBundleResponseDTO> createRegistrationBundle(
            @Valid @RequestBody CreateBundleRequestDTO request) {
        DocumentBundleResponseDTO response = bundleService.createRegistrationBundle(request.getOrderId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<DocumentBundleResponseDTO> getBundleInfo(@PathVariable Long orderId) {
        DocumentBundleResponseDTO response = bundleService.getBundleInfo(orderId);
        return ResponseEntity.ok(response);
    }
    
    // CORRECTION : Changer l'endpoint de téléchargement
    @GetMapping("/{orderId}/download")
    public ResponseEntity<Resource> downloadBundle(@PathVariable Long orderId) throws IOException {
        // 1. Générer le ZIP (simulation pour l'instant)
        String zipPath = bundleService.generateBundleDownload(orderId);
        
        // 2. Créer un fichier ZIP fictif pour la démo
        // En production, tu utiliserais une vraie génération de ZIP
        Path tempZip = createDummyZipFile(orderId);
        
        // 3. Retourner le fichier comme téléchargement
        Resource resource = new UrlResource(tempZip.toUri());
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"bundle_order_" + orderId + ".zip\"")
                .body(resource);
    }
    
    private Path createDummyZipFile(Long orderId) throws IOException {
        // Créer un répertoire temporaire pour les démos
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"), "drive_deal_bundles");
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }
        
        // Créer un fichier ZIP factice (vide pour l'instant)
        Path zipFile = tempDir.resolve("bundle_order_" + orderId + ".zip");
        
        if (!Files.exists(zipFile)) {
            // En production, tu générerais ici le vrai ZIP avec les documents
            Files.createFile(zipFile);
            Files.write(zipFile, "Ceci est un fichier ZIP factice pour la démo.\nCommande #".getBytes());
        }
        
        return zipFile;
    }
}