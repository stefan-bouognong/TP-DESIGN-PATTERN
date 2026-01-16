// GenerateDocumentRequestDTO.java
package com.example.drive_deal.dto;

import com.example.drive_deal.domain.singleton.DocumentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class GenerateDocumentRequestDTO {
    @NotNull(message = "Document type is required")
    private DocumentType documentType;
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    private Map<String, String> customData; // Données spécifiques
}