// HtmlDocument.java (version complète)
package com.example.drive_deal.domain.adapter;

import com.example.drive_deal.entity.DocumentEntity;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class HtmlDocument {
    private final DocumentEntity entity;
    
    public String getHtmlContent() {
        return entity.getContent();
    }
    
    public String getTitle() {
        return entity.getTitle();
    }
    
    // AJOUTER CETTE MÉTHODE
    public DocumentEntity getEntity() {
        return entity;
    }
    
    public String getDocumentType() {
        return entity.getType().name();
    }
    
    // Méthode utilitaire
    public Long getId() {
        return entity.getId();
    }
    
    public String getFileName() {
        return entity.getFileName();
    }
}