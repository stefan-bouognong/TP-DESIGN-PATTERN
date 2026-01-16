// PdfConversionRequestDTO.java
package com.example.drive_deal.dto;

import lombok.Data;

@Data
public class PdfConversionRequestDTO {
    private Long documentId;
    private boolean saveToDatabase = true;
    private String customFileName; // Optionnel
}