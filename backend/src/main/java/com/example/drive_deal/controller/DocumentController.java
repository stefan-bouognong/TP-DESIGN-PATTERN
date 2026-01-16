// DocumentController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.domain.singleton.DocumentType;
import com.example.drive_deal.dto.DocumentResponseDTO;
import com.example.drive_deal.dto.DocumentTemplateDTO;
import com.example.drive_deal.dto.GenerateDocumentRequestDTO;
import com.example.drive_deal.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    
    private final DocumentService documentService;
    
    @PostMapping("/generate")
    public ResponseEntity<DocumentResponseDTO> generateDocument(@Valid @RequestBody GenerateDocumentRequestDTO request) {
        DocumentResponseDTO response = documentService.generateDocument(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/order/{orderId}/bundle")
    public ResponseEntity<List<DocumentResponseDTO>> generateOrderBundle(@PathVariable Long orderId) {
        List<DocumentResponseDTO> documents = documentService.generateOrderBundle(orderId);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByOrder(@PathVariable Long orderId) {
        List<DocumentResponseDTO> documents = documentService.getDocumentsByOrder(orderId);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/template/{type}")
    public ResponseEntity<DocumentTemplateDTO> getTemplate(@PathVariable DocumentType type) {
        DocumentTemplateDTO template = documentService.getTemplate(type);
        return ResponseEntity.ok(template);
    }
}