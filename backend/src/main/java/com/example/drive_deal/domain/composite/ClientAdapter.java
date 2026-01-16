// ClientAdapter.java (fabrique pour créer les composants)
package com.example.drive_deal.domain.composite;

import com.example.drive_deal.entity.ClientEntity;
import com.example.drive_deal.entity.IndividualClientEntity;
import com.example.drive_deal.entity.CompanyClientEntity;
import org.springframework.stereotype.Component;

@Component
public class ClientAdapter {
    
    public ClientComponent adapt(ClientEntity entity) {
        if (entity instanceof IndividualClientEntity) {
            return new ClientLeaf((IndividualClientEntity) entity);
        } else if (entity instanceof CompanyClientEntity) {
            return new ClientComposite((CompanyClientEntity) entity);
        }
        throw new IllegalArgumentException("Unknown client type: " + entity.getClass().getSimpleName());
    }
}