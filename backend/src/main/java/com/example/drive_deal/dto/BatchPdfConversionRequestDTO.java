// BatchPdfConversionRequestDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class BatchPdfConversionRequestDTO {
    private List<Long> documentIds;
    private boolean createZip = false;
}