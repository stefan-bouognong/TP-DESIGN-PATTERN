package com.example.drive_deal.controller;

import com.example.drive_deal.domain.document.DocumentType;

import com.example.drive_deal.service.DocumentService2;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders/{orderId}/documents")
public class DocumentController2 {

    private final DocumentService2 documentService;

    public DocumentController2(DocumentService2 documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/{type}")
    public ResponseEntity<byte[]> downloadHtml(
            @PathVariable Long orderId,
            @PathVariable DocumentType type
    ) {
        byte[] html = documentService.generateHtml(orderId, type);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + type + "-" + orderId + ".html")
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    @GetMapping("/{type}/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Long orderId,
            @PathVariable DocumentType type
    ) {
        byte[] pdf = documentService.generatePdf(orderId, type);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + type + "-" + orderId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
