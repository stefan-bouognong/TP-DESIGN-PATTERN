// ClientRequestDTO.java
package com.example.drive_deal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class ClientRequestDTO {

    // 🔐 COMPTE
    @Email
    private String email;
    private String password;

    // 👤 CLIENT
    @NotBlank
    private String name;
    private String phone;
    private String address;

    // INDIVIDUAL
    private String firstName;
    private String lastName;
    private String nationality;

    // COMPANY
    private String companyId;
    private String vatNumber;

    @NotBlank
    private String clientType; // INDIVIDUAL | COMPANY
    private Long parentCompanyId;
}
