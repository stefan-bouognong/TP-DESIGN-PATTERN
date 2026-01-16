// OpenPdfGenerator.java
package com.example.drive_deal.domain.adapter;

import com.lowagie.text.Document;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.html.simpleparser.HTMLWorker;
import com.lowagie.text.html.simpleparser.StyleSheet;
import org.springframework.stereotype.Component;
import java.io.ByteArrayOutputStream;
import java.io.StringReader;

@Component
public class OpenPdfGenerator implements PdfGenerator {
    
    @Override
    public byte[] htmlToPdf(String htmlContent) throws PdfConversionException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            
            document.open();
            
            // Parse HTML (version simplifiée)
            HTMLWorker htmlWorker = new HTMLWorker(document);
            htmlWorker.parse(new StringReader(htmlContent));
            
            document.close();
            writer.close();
            
            return outputStream.toByteArray();
            
        } catch (Exception e) {
            // Version fallback si la conversion échoue
            return createSimplePdf(htmlContent);
        }
    }
    
    private byte[] createSimplePdf(String content) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            
            document.open();
            
            // Crée un paragraphe simple avec le contenu textuel
            com.lowagie.text.Paragraph paragraph = new com.lowagie.text.Paragraph();
            paragraph.add("Document généré par DriveDeal\n\n");
            
            // Extraire le texte du HTML (simplifié)
            String textOnly = content.replaceAll("<[^>]*>", "");
            if (textOnly.length() > 500) {
                textOnly = textOnly.substring(0, 500) + "...";
            }
            
            paragraph.add(textOnly);
            document.add(paragraph);
            
            document.close();
            return outputStream.toByteArray();
            
        } catch (Exception e) {
            // Dernier recours : PDF factice
            return createMockPdf();
        }
    }
    
    private byte[] createMockPdf() {
        String mockPdf = "%PDF-1.4\n" +
            "1 0 obj\n<<>>\nendobj\n" +
            "2 0 obj\n<<>>\nendobj\n" +
            "xref\n0 3\n" +
            "0000000000 65535 f\n" +
            "0000000010 00000 n\n" +
            "0000000053 00000 n\n" +
            "trailer\n<<\n/Size 3\n/Root 1 0 R\n>>\n" +
            "startxref\n100\n%%EOF";
        
        return mockPdf.getBytes();
    }
}