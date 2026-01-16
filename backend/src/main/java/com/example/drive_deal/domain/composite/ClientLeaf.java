// ClientLeaf.java (feuille = client individuel)
package com.example.drive_deal.domain.composite;

import com.example.drive_deal.entity.IndividualClientEntity;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ClientLeaf implements ClientComponent {
    private final IndividualClientEntity entity;
    
    @Override
    public Long getId() {
        return entity.getId();
    }
    
    @Override
    public String getName() {
        return entity.getName();
    }
    
    @Override
    public String getEmail() {
        return entity.getEmail();
    }
    
    @Override
    public String getType() {
        return "INDIVIDUAL";
    }
    
    @Override
    public void displayInfo(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "👤 " + entity.getFirstName() + " " + entity.getLastName() + 
                          " (" + entity.getEmail() + ")");
    }
    
    @Override
    public double calculateFleetDiscount() {
        return 0.0; // Pas de discount pour les particuliers
    }
    
    public IndividualClientEntity getEntity() {
        return entity;
    }
}