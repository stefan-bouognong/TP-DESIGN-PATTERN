// FormResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;

@Data
public class FormResponseDTO {
    private String formType;
    private String rendererType;
    private String title;
    private String content;
    private Long entityId;
    private String mimeType;
    private Integer fieldCount;
}