package com.example.drive_deal.controller;

import com.example.drive_deal.domain.iterator.IteratorType;
import com.example.drive_deal.dto.CatalogPageDTO;
import com.example.drive_deal.dto.IteratorFilterDTO;
import com.example.drive_deal.dto.VehicleBatchDTO;
import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.service.CatalogIteratorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/iterator")
public class CatalogIteratorController {
    
    @Autowired
    private CatalogIteratorService iteratorService;
    
    /**
     * Crée un nouvel itérateur
     */
    @PostMapping("/create")
    public ResponseEntity<?> createIterator(
            @RequestBody Map<String, Object> request) {
        
        try {
            String typeStr = (String) request.getOrDefault("type", "SEQUENTIAL");
            IteratorType type = IteratorType.valueOf(typeStr.toUpperCase());
            
            // Extraire les filtres si présents
            IteratorFilterDTO filterDTO = null;
            if (request.containsKey("filter")) {
                // Convertir Map en IteratorFilterDTO (simplifié)
                filterDTO = new IteratorFilterDTO();
                Map<String, Object> filterMap = (Map<String, Object>) request.get("filter");
                // Ici tu pourrais mapper les champs...
            }
            
            Integer pageSize = (Integer) request.get("pageSize");
            
            String iteratorId = iteratorService.createIterator(type, null, pageSize);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "iteratorId", iteratorId,
                "type", type,
                "message", "Itérateur créé avec succès",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Erreur création itérateur: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Type d'itérateur invalide: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Parcourt séquentiellement le catalogue
     */
    @GetMapping("/sequential")
    public ResponseEntity<?> iterateSequentially(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            String iteratorId = iteratorService.createIterator(
                IteratorType.SEQUENTIAL, null, null);
            
            List<VehicleEntity> vehicles = iteratorService.getBatch(iteratorId, limit);
            
            // Nettoyer l'itérateur
            iteratorService.removeIterator(iteratorId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "vehicles", vehicles,
                "count", vehicles.size(),
                "message", "Parcours séquentiel réussi",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Parcourt avec filtres
     */
    @PostMapping("/filtered")
    public ResponseEntity<?> iterateWithFilters(
            @RequestBody IteratorFilterDTO filterDTO,
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            List<VehicleEntity> vehicles = iteratorService.iterateWithFilters(filterDTO, limit);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "vehicles", vehicles,
                "count", vehicles.size(),
                "filters", filterDTO,
                "message", "Parcours filtré réussi",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Erreur itération filtrée: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Pagination du catalogue
     */
    @PostMapping("/paginated")
    public ResponseEntity<?> getPaginatedCatalog(
            @RequestBody(required = false) IteratorFilterDTO filterDTO,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            CatalogPageDTO pageDTO = iteratorService.getPage(filterDTO, page, size);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "page", pageDTO,
                "message", "Page récupérée avec succès",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Erreur pagination: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Récupère le prochain élément d'un itérateur existant
     */
    @GetMapping("/{iteratorId}/next")
    public ResponseEntity<?> getNext(@PathVariable String iteratorId) {
        try {
            VehicleEntity vehicle = iteratorService.getNext(iteratorId);
            
            if (vehicle == null) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Fin de l'itération atteinte",
                    "hasMore", false,
                    "timestamp", LocalDateTime.now()
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "vehicle", vehicle,
                "hasMore", true,
                "message", "Élément suivant récupéré",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Itérateur invalide ou expiré: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Récupère un batch d'éléments
     */
    @GetMapping("/{iteratorId}/batch")
    public ResponseEntity<?> getBatch(
            @PathVariable String iteratorId,
            @RequestParam(defaultValue = "5") int batchSize) {
        
        try {
            List<VehicleEntity> vehicles = iteratorService.getBatch(iteratorId, batchSize);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "vehicles", vehicles,
                "batchSize", vehicles.size(),
                "hasMore", !vehicles.isEmpty(),
                "message", "Batch récupéré avec succès",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Réinitialise un itérateur
     */
    @PostMapping("/{iteratorId}/reset")
    public ResponseEntity<?> resetIterator(@PathVariable String iteratorId) {
        try {
            iteratorService.resetIterator(iteratorId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Itérateur réinitialisé",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Informations sur un itérateur
     */
    @GetMapping("/{iteratorId}/info")
    public ResponseEntity<?> getIteratorInfo(@PathVariable String iteratorId) {
        try {
            Map<String, Object> info = iteratorService.getIteratorInfo(iteratorId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "info", info,
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Statistiques d'itération
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getIterationStats() {
        try {
            Map<String, Object> stats = iteratorService.getIterationStats();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", stats,
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Liste tous les itérateurs actifs
     */
    @GetMapping("/active")
    public ResponseEntity<?> listActiveIterators() {
        try {
            Map<String, Map<String, Object>> iterators = 
                iteratorService.listActiveIterators();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "iterators", iterators,
                "count", iterators.size(),
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Test du pattern Iterator
     */
    @PostMapping("/test")
    public ResponseEntity<?> testIteratorPattern() {
        try {
            Map<String, Object> results = new java.util.HashMap<>();
            results.put("timestamp", LocalDateTime.now());
            results.put("tests", new java.util.ArrayList<>());
            
            // Test 1: Itérateur séquentiel
            String seqId = iteratorService.createIterator(
                IteratorType.SEQUENTIAL, null, null);
            List<VehicleEntity> seqBatch = iteratorService.getBatch(seqId, 3);
            ((java.util.List<Map<String, Object>>) results.get("tests")).add(Map.of(
                "test", "Sequential Iterator",
                "success", !seqBatch.isEmpty(),
                "batchSize", seqBatch.size()
            ));
            iteratorService.removeIterator(seqId);
            
            // Test 2: Itérateur paginé
            String paginatedId = iteratorService.createIterator(
                IteratorType.PAGINATED, null, 5);
            List<VehicleEntity> paginatedBatch = iteratorService.getBatch(paginatedId, 5);
            ((java.util.List<Map<String, Object>>) results.get("tests")).add(Map.of(
                "test", "Paginated Iterator",
                "success", !paginatedBatch.isEmpty(),
                "pageSize", paginatedBatch.size()
            ));
            iteratorService.removeIterator(paginatedId);
            
            // Test 3: Statistiques
            Map<String, Object> stats = iteratorService.getIterationStats();
            ((java.util.List<Map<String, Object>>) results.get("tests")).add(Map.of(
                "test", "Iterator Statistics",
                "success", stats != null,
                "totalVehicles", stats.get("totalVehicles")
            ));
            
            results.put("success", true);
            results.put("message", "Tests du pattern Iterator complétés");
            
            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur test Iterator: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Recherche avancée avec filtres multiples
     */
    @PostMapping("/search")
    public ResponseEntity<?> searchVehicles(
            @RequestBody IteratorFilterDTO filterDTO,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "50") int limit) {
        
        try {
            List<VehicleEntity> vehicles = iteratorService.iterateWithFilters(filterDTO, limit);
            
            // Appliquer l'offset si nécessaire
            if (offset > 0 && offset < vehicles.size()) {
                vehicles = vehicles.subList(offset, Math.min(offset + limit, vehicles.size()));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "vehicles", vehicles,
                "totalResults", vehicles.size(),
                "offset", offset,
                "limit", limit,
                "filters", filterDTO,
                "message", "Recherche effectuée avec succès",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}