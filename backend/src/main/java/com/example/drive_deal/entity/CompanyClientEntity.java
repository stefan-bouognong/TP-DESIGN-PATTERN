// CompanyClientEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("COMPANY")
@Data
public class CompanyClientEntity extends ClientEntity {
    private String companyId; // SIRET / Tax ID
    private String vatNumber;
    
   @OneToMany(mappedBy = "parentCompany", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CompanyClientEntity> subsidiaries = new ArrayList<>();
        
    // Méthode helper pour ajouter une filiale
    public void addSubsidiary(CompanyClientEntity subsidiary) {
        subsidiary.setParentCompany(this);
        this.subsidiaries.add(subsidiary);
    }
}