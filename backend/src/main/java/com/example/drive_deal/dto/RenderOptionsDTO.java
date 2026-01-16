// RenderOptionsDTO.java
package com.example.drive_deal.dto;

import lombok.Data;

@Data
public class RenderOptionsDTO {
    private Boolean includeTechnicalDetails = true;
    private Boolean includeFinancialDetails = true;
    private Boolean includeCompanyDetails = false;
    private String theme = "default";
    private Boolean compactMode = false;
}