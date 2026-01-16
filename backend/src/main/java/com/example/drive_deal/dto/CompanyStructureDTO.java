// CompanyStructureDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class CompanyStructureDTO {
    private Long companyId;
    private String companyName;
    private String email;
    private int totalSubsidiaries;
    private double fleetDiscount;
    private List<CompanyStructureDTO> subsidiaries = new ArrayList<>();
}