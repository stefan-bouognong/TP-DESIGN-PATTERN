// DocumentBundleResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class DocumentBundleResponseDTO {
    private Long orderId;
    private Long clientId;
    private String bundleName;
    private int documentCount;
    private boolean completed;
    private String downloadPath;
    private List<String> documentTypes;
}