// PdfService.java
package com.example.drive_deal.service;

import com.example.drive_deal.domain.adapter.*;
import com.example.drive_deal.dto.*;
import com.example.drive_deal.entity.DocumentEntity;
// import com.example.drive_deal.entity.DocumentType;
import com.example.drive_deal.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PdfService {
    
    private final DocumentAdapterFactory adapterFactory;
    private final DocumentRepository documentRepository;
    
    @Transactional
    public PdfResponseDTO convertToPdf(PdfConversionRequestDTO request) {
        // Récupérer le document HTML
        DocumentEntity document = documentRepository.findById(request.getDocumentId())
            .orElseThrow(() -> new IllegalArgumentException("Document not found: " + request.getDocumentId()));
        
        // Vérifier que c'est bien un document HTML
        if (!"HTML".equalsIgnoreCase(document.getFormat())) {
            throw new IllegalArgumentException("Document is not HTML format: " + document.getFormat());
        }
        
        // Créer l'adapter
        PdfDocumentAdapter pdfAdapter = adapterFactory.createPdfAdapter(document);
        
        // Générer le PDF
        byte[] pdfBytes = pdfAdapter.generatePdf();
        
        // Sauvegarder en base si demandé
        DocumentEntity pdfDocument = null;
        if (request.isSaveToDatabase()) {
            pdfDocument = savePdfDocument(document, pdfBytes, pdfAdapter.getFileName());
        }
        
        // Construire la réponse
        return buildPdfResponse(document, pdfAdapter, pdfDocument != null);
    }
    
    @Transactional
    public BatchPdfResponseDTO convertBatchToPdf(BatchPdfConversionRequestDTO request) {
        List<PdfResponseDTO> convertedDocs = new ArrayList<>();
        int successful = 0;
        int failed = 0;
        
        for (Long docId : request.getDocumentIds()) {
            try {
                PdfConversionRequestDTO singleRequest = new PdfConversionRequestDTO();
                singleRequest.setDocumentId(docId);
                singleRequest.setSaveToDatabase(true);
                
                PdfResponseDTO result = convertToPdf(singleRequest);
                convertedDocs.add(result);
                successful++;
            } catch (Exception e) {
                failed++;
                // Log l'erreur mais continue avec les autres documents
                System.err.println("Failed to convert document " + docId + ": " + e.getMessage());
            }
        }
        
        BatchPdfResponseDTO response = new BatchPdfResponseDTO();
        response.setTotalDocuments(request.getDocumentIds().size());
        response.setSuccessfulConversions(successful);
        response.setFailedConversions(failed);
        response.setConvertedDocuments(convertedDocs);
        
        // TODO: Implémenter la création de ZIP si demandé
        if (request.isCreateZip() && successful > 0) {
            response.setZipDownloadUrl("/api/pdf/download/zip?ids=" + 
                request.getDocumentIds().stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(",")));
        }
        
        return response;
    }
    
    @Transactional
    public PdfResponseDTO convertOrderDocumentsToPdf(Long orderId) {
        // Récupérer tous les documents de la commande
        List<DocumentEntity> orderDocuments = documentRepository.findByOrderId(orderId);
        
        if (orderDocuments.isEmpty()) {
            throw new IllegalArgumentException("No documents found for order: " + orderId);
        }
        
        // Convertir chaque document
        List<Long> documentIds = orderDocuments.stream()
            .filter(doc -> "HTML".equalsIgnoreCase(doc.getFormat()))
            .map(DocumentEntity::getId)
            .toList();
        
        BatchPdfConversionRequestDTO batchRequest = new BatchPdfConversionRequestDTO();
        batchRequest.setDocumentIds(documentIds);
        batchRequest.setCreateZip(true);
        
        BatchPdfResponseDTO batchResult = convertBatchToPdf(batchRequest);
        
        // Retourner le premier document converti (ou créer une réponse synthétique)
        if (!batchResult.getConvertedDocuments().isEmpty()) {
            return batchResult.getConvertedDocuments().get(0);
        }
        
        throw new RuntimeException("No documents were converted for order: " + orderId);
    }
    
    @Transactional(readOnly = true)
    public byte[] getPdfContent(Long documentId) {
        DocumentEntity document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));
        
        // Si le document est déjà un PDF
        if ("PDF".equalsIgnoreCase(document.getFormat())) {
            return document.getContent().getBytes(); // Dans une vraie app, le contenu serait en BLOB
        }
        
        // Sinon, convertir à la volée
        if (!"HTML".equalsIgnoreCase(document.getFormat())) {
            throw new IllegalArgumentException("Cannot convert from format: " + document.getFormat());
        }
        
        PdfDocumentAdapter adapter = adapterFactory.createPdfAdapter(document);
        return adapter.generatePdf();
    }
    
    private DocumentEntity savePdfDocument(DocumentEntity originalDoc, byte[] pdfBytes, String fileName) {
        // Créer une nouvelle entrée pour le PDF
        DocumentEntity pdfDocument = new DocumentEntity();
        pdfDocument.setType(originalDoc.getType());
        pdfDocument.setTitle(originalDoc.getTitle() + " (PDF)");
        pdfDocument.setContent(new String(pdfBytes)); // Dans une vraie app: stocker en BLOB
        pdfDocument.setFormat("PDF");
        pdfDocument.setOrder(originalDoc.getOrder());
        pdfDocument.setClient(originalDoc.getClient());
        pdfDocument.setFileName(fileName);
        
        return documentRepository.save(pdfDocument);
    }
    
    private PdfResponseDTO buildPdfResponse(DocumentEntity originalDoc, 
                                          PdfDocumentAdapter adapter, 
                                          boolean savedToDb) {
        PdfResponseDTO response = new PdfResponseDTO();
        response.setDocumentId(originalDoc.getId());
        response.setOriginalTitle(originalDoc.getTitle());
        response.setPdfFileName(adapter.getFileName());
        response.setFileSize(adapter.getFileSize());
        response.setSavedToDatabase(savedToDb);
        
        // URL de téléchargement
        if (savedToDb) {
            response.setDownloadUrl("/api/pdf/download/" + originalDoc.getId());
        } else {
            response.setDownloadUrl("/api/pdf/temp/" + originalDoc.getId());
        }
        
        return response;
    }
}