// ClientComposite.java (composite = société avec filiales)
package com.example.drive_deal.domain.composite;

import com.example.drive_deal.entity.CompanyClientEntity;
import com.example.drive_deal.entity.ClientEntity;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ClientComposite implements ClientComponent {
    private final CompanyClientEntity entity;
    private final List<ClientComponent> children = new ArrayList<>();
    
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
        return "COMPANY";
    }
    
    @Override
    public void displayInfo(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "🏢 " + entity.getName() + 
                          " (SIRET: " + entity.getCompanyId() + ")");
        
        for (ClientComponent child : children) {
            child.displayInfo(depth + 1);
        }
    }
    
    @Override
    public double calculateFleetDiscount() {
        int subsidiaryCount = countSubsidiaries();
        double baseDiscount = 0.05; // 5% de base pour une société
        
        if (subsidiaryCount >= 5) {
            return baseDiscount + 0.10; // +10% si 5+ filiales
        } else if (subsidiaryCount >= 2) {
            return baseDiscount + 0.05; // +5% si 2+ filiales
        }
        return baseDiscount;
    }
    
    public void addChild(ClientComponent child) {
        children.add(child);
    }
    
    public void removeChild(ClientComponent child) {
        children.remove(child);
    }
    
    public List<ClientComponent> getChildren() {
        return new ArrayList<>(children);
    }
    
    private int countSubsidiaries() {
        int count = 0;
        for (ClientComponent child : children) {
            if (child instanceof ClientComposite) {
                count += 1 + ((ClientComposite) child).countSubsidiaries();
            } else {
                count++;
            }
        }
        return count;
    }
    
    public CompanyClientEntity getEntity() {
        return entity;
    }
}