package com.example.drive_deal.service;

import com.example.drive_deal.domain.document.DocumentType;

public interface DocumentService2 {

    byte[] generateHtml(Long orderId, DocumentType type);

    byte[] generatePdf(Long orderId, DocumentType type);
}
