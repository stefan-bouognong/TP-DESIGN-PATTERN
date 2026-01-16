package com.example.drive_deal.domain.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PdfDocumentAdapter implements PdfDocument {
    
    private final PdfGenerator pdfGenerator;
    private byte[] pdfBytes;
    private HtmlDocument htmlDocument;
    
    @Autowired
    public PdfDocumentAdapter(PdfGenerator pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
    }
    
    public void setHtmlDocument(HtmlDocument htmlDocument) {
        this.htmlDocument = htmlDocument;
    }
    
    @Override
    public byte[] generatePdf() {
        validateHtmlDocument();
        
        if (pdfBytes == null) {
            String htmlContent = htmlDocument.getHtmlContent();
            pdfBytes = pdfGenerator.htmlToPdf(htmlContent);
        }
        return pdfBytes;
    }
    
    @Override
    public String getFileName() {
        validateHtmlDocument();
        
        String originalName = htmlDocument.getFileName();
        if (originalName == null) {
            return "document_" + htmlDocument.getId() + ".pdf";
        }
        return originalName.replace(".html", ".pdf").replace(".HTML", ".pdf");
    }
    
    @Override
    public String getContentType() {
        return "application/pdf";
    }
    
    @Override
    public long getFileSize() {
        if (pdfBytes == null) {
            generatePdf();
        }
        return pdfBytes.length;
    }
    
    // Méthodes supplémentaires
    public String getOriginalHtml() {
        validateHtmlDocument();
        return htmlDocument.getHtmlContent();
    }
    
    public Long getDocumentId() {
        validateHtmlDocument();
        return htmlDocument.getId();
    }
    
    public HtmlDocument getHtmlDocument() {
        return htmlDocument;
    }
    
    private void validateHtmlDocument() {
        if (htmlDocument == null) {
            throw new IllegalStateException("HtmlDocument not set. Call setHtmlDocument() first.");
        }
    }
}