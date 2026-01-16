// ClientResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class ClientResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String clientType;
    private String companyId;
    private String vatNumber;
    private String firstName;
    private String lastName;
    private String nationality;
    private Long parentCompanyId;
    private Double fleetDiscount; // Pour les sociétés
}