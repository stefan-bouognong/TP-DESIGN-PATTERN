// PdfStyleUtils.java - VERSION SIMPLIFIÉE
package com.example.drive_deal.utils;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import java.awt.Color;

public class PdfStyleUtils {
    
    // Couleurs principales
    public static final Color PRIMARY_COLOR = new Color(26, 62, 114); // #1a3e72
    public static final Color SECONDARY_COLOR = new Color(240, 245, 255);
    public static final Color LIGHT_BG = new Color(248, 249, 250);
    public static final Color ACCENT_COLOR = new Color(211, 47, 47);
    
    // Polices
    public static Font getTitleFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(24);
        font.setColor(PRIMARY_COLOR);
        return font;
    }
    
    public static Font getSubtitleFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(16);
        font.setColor(PRIMARY_COLOR);
        return font;
    }
    
    public static Font getNormalFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(12);
        font.setColor(Color.BLACK);
        return font;
    }
    
    public static Font getBoldFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(12);
        font.setColor(PRIMARY_COLOR);
        return font;
    }
    
    public static Font getLabelFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(11);
        font.setColor(PRIMARY_COLOR);
        return font;
    }
    
    public static Font getSmallFont() {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(10);
        font.setColor(Color.DARK_GRAY);
        return font;
    }
    
    // Méthode simple pour créer un header
    public static Element createDocumentHeader() throws DocumentException {
        Paragraph header = new Paragraph();
        header.setAlignment(Element.ALIGN_CENTER);
        
        // Titre principal
        Paragraph title = new Paragraph("DriveDeal", 
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, PRIMARY_COLOR));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(5);
        header.add(title);
        
        // Sous-titre
        Paragraph subtitle = new Paragraph("Concessionnaire Automobile de Confiance", 
            FontFactory.getFont(FontFactory.HELVETICA, 14, Color.DARK_GRAY));
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(5);
        header.add(subtitle);
        
        // Contact
        Paragraph contact = new Paragraph(
            "123 Avenue des Libertés, Yaoundé, Cameroun | " +
            "Tél: +237 6 XX XX XX XX | Email: contact@drivedeal.cm", 
            FontFactory.getFont(FontFactory.HELVETICA, 11, Color.DARK_GRAY));
        contact.setAlignment(Element.ALIGN_CENTER);
        contact.setSpacingAfter(20);
        header.add(contact);
        
        return header;
    }
    
    // Méthode utilitaire simple pour créer une cellule
    public static PdfPCell createStyledCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        return cell;
    }
}