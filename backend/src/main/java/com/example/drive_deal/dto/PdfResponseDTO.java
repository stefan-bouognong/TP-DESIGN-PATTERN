// PdfResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;

@Data
public class PdfResponseDTO {
    private Long documentId;
    private String originalTitle;
    private String pdfFileName;
    private long fileSize;
    private String downloadUrl;
    private boolean savedToDatabase;
}