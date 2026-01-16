// DocumentBundle.java (Produit final)
package com.example.drive_deal.domain.builder;

import com.example.drive_deal.entity.DocumentEntity;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class DocumentBundle {
    private Long orderId;
    private Long clientId;
    private String bundleName;
    private List<DocumentEntity> documents = new ArrayList<>();
    private boolean completed = false;
    private String downloadPath;
    
    public void addDocument(DocumentEntity document) {
        documents.add(document);
    }
    
    public int getDocumentCount() {
        return documents.size();
    }
    
    public DocumentEntity getDocumentByType(String type) {
        return documents.stream()
            .filter(doc -> doc.getType().name().equals(type))
            .findFirst()
            .orElse(null);
    }
    
    @Override
    public String toString() {
        return String.format("DocumentBundle[orderId=%d, documents=%d, completed=%s]", 
            orderId, documents.size(), completed);
    }
}