// PdfStyleUtils.java - VERSION AMÉLIORÉE
package com.example.drive_deal.utils;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import java.awt.Color;

public class PdfStyleUtils {
    
    // Palette de couleurs moderne
    public static final Color PRIMARY_DARK = new Color(26, 62, 114);      // #1a3e72
    public static final Color PRIMARY_LIGHT = new Color(41, 98, 180);     // #2962b4
    public static final Color SECONDARY_BG = new Color(240, 245, 255);    // #f0f5ff
    public static final Color LIGHT_GRAY = new Color(248, 249, 250);      // #f8f9fa
    public static final Color ACCENT_RED = new Color(211, 47, 47);        // #d32f2f
    public static final Color SUCCESS_GREEN = new Color(46, 125, 50);     // #2e7d32
    public static final Color WARNING_ORANGE = new Color(245, 124, 0);    // #f57c00
    public static final Color BORDER_COLOR = new Color(224, 224, 224);    // #e0e0e0
    public static final Color TEXT_SECONDARY = new Color(117, 117, 117);  // #757575
    
    // === POLICES PRINCIPALES ===
    
    public static Font getTitleFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(28);
        font.setColor(PRIMARY_DARK);
        return font;
    }
    
    public static Font getSubtitleFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);
        font.setColor(PRIMARY_DARK);
        return font;
    }
    
    public static Font getSectionTitleFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(14);
        font.setColor(PRIMARY_LIGHT);
        return font;
    }
    
    public static Font getNormalFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(11);
        font.setColor(Color.BLACK);
        return font;
    }
    
    public static Font getBoldFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(11);
        font.setColor(PRIMARY_DARK);
        return font;
    }
    
    public static Font getLabelFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(10);
        font.setColor(TEXT_SECONDARY);
        return font;
    }
    
    public static Font getSmallFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(9);
        font.setColor(TEXT_SECONDARY);
        return font;
    }
    
    public static Font getItalicFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE);
        font.setSize(10);
        font.setColor(TEXT_SECONDARY);
        return font;
    }
    
    // === HEADER PROFESSIONNEL ===
    
    public static PdfPTable createDocumentHeader() throws DocumentException {
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);
        headerTable.setSpacingAfter(20);
        
        // Cellule principale avec background
        PdfPCell headerCell = new PdfPCell();
        headerCell.setBackgroundColor(SECONDARY_BG);
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPadding(15);
        headerCell.setPaddingBottom(20);
        
        // Titre principal
        Paragraph title = new Paragraph("DriveDeal", getTitleFont());
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(8);
        headerCell.addElement(title);
        
        // Sous-titre élégant
        Paragraph subtitle = new Paragraph("Concessionnaire Automobile de Confiance", 
            FontFactory.getFont(FontFactory.HELVETICA, 13, PRIMARY_LIGHT));
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(12);
        headerCell.addElement(subtitle);
        
        // Ligne de séparation
        Paragraph separator = new Paragraph("─────────────────────────────────", 
            FontFactory.getFont(FontFactory.HELVETICA, 10, BORDER_COLOR));
        separator.setAlignment(Element.ALIGN_CENTER);
        separator.setSpacingAfter(10);
        headerCell.addElement(separator);
        
        // Informations de contact
        Paragraph contact = new Paragraph(
            "📍 123 Avenue des Libertés, Yaoundé, Cameroun\n" +
            "☎ +237 6 XX XX XX XX  |  ✉ contact@drivedeal.cm", 
            FontFactory.getFont(FontFactory.HELVETICA, 10, TEXT_SECONDARY));
        contact.setAlignment(Element.ALIGN_CENTER);
        headerCell.addElement(contact);
        
        headerTable.addCell(headerCell);
        return headerTable;
    }
    
    // === STYLES DE CELLULES ===
    
    public static PdfPCell createStyledCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(10);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(BORDER_COLOR);
        cell.setBorderWidth(0.5f);
        return cell;
    }
    
    public static PdfPCell createHeaderCell(String text) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Paragraph(text, headerFont));
        cell.setBackgroundColor(PRIMARY_DARK);
        cell.setPadding(12);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }
    
    public static PdfPCell createLabelCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, getLabelFont()));
        cell.setBackgroundColor(LIGHT_GRAY);
        cell.setPadding(10);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(BORDER_COLOR);
        cell.setBorderWidth(0.5f);
        return cell;
    }
    
    public static PdfPCell createValueCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, getNormalFont()));
        cell.setPadding(10);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(BORDER_COLOR);
        cell.setBorderWidth(0.5f);
        return cell;
    }
    
    public static PdfPCell createHighlightCell(String text) {
        Font highlightFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_DARK);
        PdfPCell cell = new PdfPCell(new Paragraph(text, highlightFont));
        cell.setBackgroundColor(SECONDARY_BG);
        cell.setPadding(12);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(PRIMARY_LIGHT);
        cell.setBorderWidth(1f);
        return cell;
    }
    
    public static PdfPCell createSuccessCell(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, SUCCESS_GREEN);
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBackgroundColor(new Color(232, 245, 233));
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorderColor(SUCCESS_GREEN);
        cell.setBorderWidth(0.5f);
        return cell;
    }
    
    public static PdfPCell createWarningCell(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, WARNING_ORANGE);
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBackgroundColor(new Color(255, 243, 224));
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorderColor(WARNING_ORANGE);
        cell.setBorderWidth(0.5f);
        return cell;
    }
    
    // === SECTIONS ET TITRES ===
    
    public static Paragraph createSectionTitle(String title) {
        Paragraph section = new Paragraph(title, getSectionTitleFont());
        section.setSpacingBefore(15);
        section.setSpacingAfter(10);
        return section;
    }
    
    public static PdfPTable createSectionDivider() {
        PdfPTable divider = new PdfPTable(1);
        divider.setWidthPercentage(100);
        divider.setSpacingBefore(10);
        divider.setSpacingAfter(10);
        
        PdfPCell cell = new PdfPCell();
        cell.setFixedHeight(2f);
        cell.setBackgroundColor(BORDER_COLOR);
        cell.setBorder(Rectangle.NO_BORDER);
        
        divider.addCell(cell);
        return divider;
    }
    
    // === FOOTER ===
    
    public static Paragraph createFooter() {
        Paragraph footer = new Paragraph(
            "Document généré le " + new java.text.SimpleDateFormat("dd/MM/yyyy à HH:mm").format(new java.util.Date()) +
            " | DriveDeal - Votre partenaire automobile de confiance", 
            getSmallFont());
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(20);
        return footer;
    }
}