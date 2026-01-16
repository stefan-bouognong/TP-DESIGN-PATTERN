// BatchPdfResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class BatchPdfResponseDTO {
    private int totalDocuments;
    private int successfulConversions;
    private int failedConversions;
    private List<PdfResponseDTO> convertedDocuments;
    private String zipDownloadUrl; // Si createZip=true
}