// PdfController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.*;
import com.example.drive_deal.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {
    
    private final PdfService pdfService;
    
    @PostMapping("/convert")
    public ResponseEntity<PdfResponseDTO> convertToPdf(@Valid @RequestBody PdfConversionRequestDTO request) {
        PdfResponseDTO response = pdfService.convertToPdf(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/convert/batch")
    public ResponseEntity<BatchPdfResponseDTO> convertBatchToPdf(
            @Valid @RequestBody BatchPdfConversionRequestDTO request) {
        BatchPdfResponseDTO response = pdfService.convertBatchToPdf(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/convert/order/{orderId}")
    public ResponseEntity<PdfResponseDTO> convertOrderDocuments(@PathVariable Long orderId) {
        PdfResponseDTO response = pdfService.convertOrderDocumentsToPdf(orderId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long documentId) {
        byte[] pdfContent = pdfService.getPdfContent(documentId);
        
        ByteArrayResource resource = new ByteArrayResource(pdfContent);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"document_" + documentId + ".pdf\"")
                .body(resource);
    }
    
    @GetMapping("/preview/{documentId}")
    public ResponseEntity<Resource> previewPdf(@PathVariable Long documentId) {
        byte[] pdfContent = pdfService.getPdfContent(documentId);
        
        ByteArrayResource resource = new ByteArrayResource(pdfContent);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "inline; filename=\"preview_" + documentId + ".pdf\"")
                .body(resource);
    }
    
    @GetMapping("/status/{documentId}")
    public ResponseEntity<String> checkPdfStatus(@PathVariable Long documentId) {
        // Vérifier si un PDF existe pour ce document
        // Implémentation simplifiée
        return ResponseEntity.ok("PDF available for download");
    }
}