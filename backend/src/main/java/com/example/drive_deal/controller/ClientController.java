// ClientController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.ClientRequestDTO;
import com.example.drive_deal.dto.ClientResponseDTO;
import com.example.drive_deal.dto.CompanyStructureDTO;
import com.example.drive_deal.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    
    private final ClientService clientService;

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> getClientById(@PathVariable Long id) {
        ClientResponseDTO response = clientService.getClientById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> createClient(@Valid @RequestBody ClientRequestDTO request) {
        ClientResponseDTO response = clientService.createClient(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/company/{parentId}/add")
    public ResponseEntity<ClientResponseDTO> addSubsidiary(
            @PathVariable Long parentId,
            @Valid @RequestBody ClientRequestDTO request) {
        ClientResponseDTO response = clientService.addSubsidiary(parentId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}/structure")
    public ResponseEntity<CompanyStructureDTO> getCompanyStructure(@PathVariable Long id) {
        CompanyStructureDTO structure = clientService.getCompanyStructure(id);
        return ResponseEntity.ok(structure);
    }
    
    @GetMapping("/company/{parentId}/subsidiaries")
    public ResponseEntity<List<ClientResponseDTO>> getSubsidiaries(@PathVariable Long parentId) {
        List<ClientResponseDTO> subsidiaries = clientService.getSubsidiaries(parentId);
        return ResponseEntity.ok(subsidiaries);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        // À implémenter avec vérifications
        return ResponseEntity.noContent().build();
    }
}