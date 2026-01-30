package com.example.drive_deal.domain.adapter;

import com.example.drive_deal.utils.PdfStyleUtils;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.awt.Color;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.HashMap;
import java.util.Map;

@Component
public class OpenPdfGenerator implements PdfGenerator {
    
    @Override
    public byte[] htmlToPdf(String htmlContent) throws PdfConversionException {
        try {
            Document pdfDoc = new Document(PageSize.A4, 50, 50, 50, 50);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(pdfDoc, baos);
            
            pdfDoc.open();
            
            pdfDoc.add(createStyledHeader());
            
            String docType = detectDocumentType(htmlContent);
            String title = extractTitle(htmlContent);
            
            if (title == null || title.isEmpty()) {
                title = "Document DriveDeal";
            }
            
            Paragraph docTitle = new Paragraph(title, PdfStyleUtils.getTitleFont());
            docTitle.setAlignment(Element.ALIGN_CENTER);
            docTitle.setSpacingAfter(20);
            pdfDoc.add(docTitle);
            
            Map<String, String> data = extractDataFromHtml(htmlContent);
            
            switch (docType.toLowerCase()) {
                case "registration":
                case "demande d'immatriculation":
                    generateRegistrationContent(pdfDoc, data);
                    break;
                case "invoice":
                case "facture":
                    generateInvoiceContent(pdfDoc, data);
                    break;
                case "transfer":
                case "cession":
                    generateTransferContent(pdfDoc, data);
                    break;
                default:
                    generateGenericContent(pdfDoc, data);
            }
            
            addStyledFooter(pdfDoc);
            
            pdfDoc.close();
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new PdfConversionException("Erreur conversion HTML vers PDF", e);
        }
    }
    
    // ========== MÉTHODES D'ANALYSE HTML ==========
    
    private String detectDocumentType(String html) {
        if (html == null) return "generic";
        
        html = html.toLowerCase();
        
        if (html.contains("demande d'immatriculation") || html.contains("registration")) {
            return "registration";
        } else if (html.contains("facture") || html.contains("invoice")) {
            return "invoice";
        } else if (html.contains("cession") || html.contains("transfer")) {
            return "transfer";
        } else if (html.contains("bon de commande") || html.contains("order")) {
            return "order";
        }
        
        return "generic";
    }
    
    private String extractTitle(String html) {
        Pattern pattern = Pattern.compile("<title>(.*?)</title>", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        // Chercher aussi dans les h1
        pattern = Pattern.compile("<h1[^>]*>(.*?)</h1>", Pattern.CASE_INSENSITIVE);
        matcher = pattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(1).replaceAll("<[^>]*>", "");
        }
        
        return null;
    }
    
    private Map<String, String> extractDataFromHtml(String html) {
        Map<String, String> data = new HashMap<>();
        
        if (html == null) return data;
        
        try {
            Pattern pattern = Pattern.compile(
                "<span[^>]*class\\s*=\\s*[\"']label[\"'][^>]*>(.*?)</span>\\s*(.*?)(?:</p>|<br|<div)",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL
            );
            
            Matcher matcher = pattern.matcher(html);
            while (matcher.find()) {
                String label = matcher.group(1).replaceAll("<[^>]*>", "").trim();
                String value = matcher.group(2).replaceAll("<[^>]*>", "").trim();
                
                label = label.replace(":", "").trim();
                
                if (!label.isEmpty() && !value.isEmpty()) {
                    data.put(label, value);
                }
            }
            
            pattern = Pattern.compile(
                "<p>(.*?)</p>", 
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL
            );
            
            matcher = pattern.matcher(html);
            while (matcher.find()) {
                String content = matcher.group(1).replaceAll("<[^>]*>", "").trim();
                if (content.length() > 10 && content.contains(":")) {
                    String[] parts = content.split(":", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        if (!key.isEmpty() && !value.isEmpty()) {
                            data.put(key, value);
                        }
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Erreur extraction données HTML: " + e.getMessage());
        }
        
        return data;
    }
    
    // ========== MÉTHODES DE GÉNÉRATION DE CONTENU ==========
    
    private void generateRegistrationContent(Document pdfDoc, Map<String, String> data) 
            throws DocumentException {
        
        // Section Informations Client
        addSectionTitle(pdfDoc, "INFORMATIONS CLIENT");
        
        PdfPTable clientTable = new PdfPTable(2);
        clientTable.setWidthPercentage(100);
        clientTable.setSpacingBefore(10);
        clientTable.setSpacingAfter(20);
        
        addTableRow(clientTable, "Client", data.get("Client"));
        addTableRow(clientTable, "Adresse", data.get("Adresse"));
        addTableRow(clientTable, "Date de demande", data.get("Date de demande"));
        
        pdfDoc.add(clientTable);
        
        // Section Détails du Véhicule
        addSectionTitle(pdfDoc, "DÉTAILS DU VÉHICULE");
        
        PdfPTable vehicleTable = new PdfPTable(2);
        vehicleTable.setWidthPercentage(100);
        vehicleTable.setSpacingBefore(10);
        
        addTableRow(vehicleTable, "Modèle", data.get("Modèle"));
        addTableRow(vehicleTable, "Numéro VIN", data.get("Numéro VIN"));
        
        pdfDoc.add(vehicleTable);
    }
    
    private void generateInvoiceContent(Document pdfDoc, Map<String, String> data) 
            throws DocumentException {
        
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        
        for (Map.Entry<String, String> entry : data.entrySet()) {
            addTableRow(table, entry.getKey(), entry.getValue());
        }
        
        pdfDoc.add(table);
    }
    
    private void generateTransferContent(Document pdfDoc, Map<String, String> data) 
            throws DocumentException {
        
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        
        for (Map.Entry<String, String> entry : data.entrySet()) {
            addTableRow(table, entry.getKey(), entry.getValue());
        }
        
        pdfDoc.add(table);
    }
    
    private void generateGenericContent(Document pdfDoc, Map<String, String> data) 
            throws DocumentException {
        
        if (data.isEmpty()) {
            Paragraph message = new Paragraph(
                "Document généré par DriveDeal", 
                PdfStyleUtils.getNormalFont()
            );
            message.setAlignment(Element.ALIGN_CENTER);
            pdfDoc.add(message);
            return;
        }
        
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        
        for (Map.Entry<String, String> entry : data.entrySet()) {
            addTableRow(table, entry.getKey(), entry.getValue());
        }
        
        pdfDoc.add(table);
    }
    
    // ========== MÉTHODES UTILITAIRES ==========
    
    private Element createStyledHeader() throws DocumentException {
        return PdfStyleUtils.createDocumentHeader();
    }
    
    private void addSectionTitle(Document pdfDoc, String title) throws DocumentException {
        Paragraph sectionTitle = new Paragraph(title, PdfStyleUtils.getSubtitleFont());
        sectionTitle.setSpacingBefore(15);
        sectionTitle.setSpacingAfter(10);
        pdfDoc.add(sectionTitle);
    }
    
    private void addTableRow(PdfPTable table, String label, String value) {
        if (value == null || value.isEmpty()) return;
        
        PdfPCell labelCell = new PdfPCell(new Paragraph(label + " :", 
            PdfStyleUtils.getLabelFont()));
        labelCell.setBackgroundColor(PdfStyleUtils.LIGHT_GRAY);
        labelCell.setPadding(8);
        labelCell.setBorderWidth(0);
        
        PdfPCell valueCell = new PdfPCell(new Paragraph(value, 
            PdfStyleUtils.getNormalFont()));
        valueCell.setPadding(8);
        valueCell.setBorderWidth(0);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
    
    private void addStyledFooter(Document pdfDoc) throws DocumentException {
        Paragraph footer = new Paragraph();
        footer.setSpacingBefore(40);
        
        // Ligne de signature
        PdfPTable signatureTable = new PdfPTable(1);
        signatureTable.setWidthPercentage(100);
        
        PdfPCell signatureCell = new PdfPCell(new Paragraph("Signature", 
            PdfStyleUtils.getNormalFont()));
        signatureCell.setBorder(Rectangle.TOP);
        signatureCell.setBorderWidth(1);
        signatureCell.setPaddingTop(20);
        signatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        signatureTable.addCell(signatureCell);
        
        footer.add(signatureTable);
        
        // Copyright
        Paragraph copyright = new Paragraph(
            "© 2024 DriveDeal - Tous droits réservés", 
            PdfStyleUtils.getSmallFont()
        );
        copyright.setAlignment(Element.ALIGN_CENTER);
        copyright.setSpacingBefore(10);
        footer.add(copyright);
        
        pdfDoc.add(footer);
    }
    
    
    private String extractPlainText(String html) {
        if (html == null) return "";
        
        return html
            .replaceAll("<[^>]*>", " ")
            .replaceAll("\\s+", " ")
            .replaceAll("&nbsp;", " ")
            .trim();
    }
}