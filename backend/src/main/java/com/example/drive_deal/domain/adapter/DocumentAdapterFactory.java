// DocumentAdapterFactory.java (CORRIGÉ)
package com.example.drive_deal.domain.adapter;

import com.example.drive_deal.entity.DocumentEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocumentAdapterFactory {
    
    private final PdfGenerator pdfGenerator;
    
    public PdfDocumentAdapter createPdfAdapter(DocumentEntity entity) {
        HtmlDocument htmlDocument = new HtmlDocument(entity);
        PdfDocumentAdapter adapter = new PdfDocumentAdapter(pdfGenerator);
        adapter.setHtmlDocument(htmlDocument);
        return adapter;
    }
    
    public PdfDocumentAdapter createPdfAdapter(HtmlDocument htmlDocument) {
        PdfDocumentAdapter adapter = new PdfDocumentAdapter(pdfGenerator);
        adapter.setHtmlDocument(htmlDocument);
        return adapter;
    }
}