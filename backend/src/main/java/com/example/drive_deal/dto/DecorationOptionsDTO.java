// DecorationOptionsDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class DecorationOptionsDTO {
    private List<String> decorators; // ["ANIMATION", "SALE", "OPTIONS", "RECOMMENDATION"]
    private Boolean includeAnimations = true;
    private Boolean includeSaleBadge = false;
    private Boolean showOptions = true;
    private Boolean showRecommendations = false;
    private String theme = "default";
}