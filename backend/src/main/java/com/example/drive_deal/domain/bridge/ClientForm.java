// ClientForm.java (RefinedAbstraction - Formulaire client)
package com.example.drive_deal.domain.bridge;

import com.example.drive_deal.entity.ClientEntity;
import lombok.Getter;

@Getter
public class ClientForm extends Form {
    
    private ClientEntity client;
    private boolean includeCompanyDetails = false;
    
    public ClientForm(FormRenderer renderer, ClientEntity client) {
        super(renderer);
        this.client = client;
    }
    
    public ClientForm(FormRenderer renderer) {
        super(renderer);
    }
    
    @Override
    public String render() {
        StringBuilder builder = new StringBuilder();
        
        // Champs communs
        builder.append(renderer.renderField("name", "Nom", client.getName()));
        builder.append(renderer.renderField("email", "Email", client.getEmail()));
        builder.append(renderer.renderField("phone", "Téléphone", client.getPhone()));
        builder.append(renderer.renderField("address", "Adresse", client.getAddress()));
        
        // Détails spécifiques au type
        if (client instanceof com.example.drive_deal.entity.IndividualClientEntity) {
            com.example.drive_deal.entity.IndividualClientEntity individual = 
                (com.example.drive_deal.entity.IndividualClientEntity) client;
            builder.append(renderer.renderField("firstName", "Prénom", individual.getFirstName()));
            builder.append(renderer.renderField("lastName", "Nom de famille", individual.getLastName()));
            builder.append(renderer.renderField("nationality", "Nationalité", individual.getNationality()));
        } 
        else if (client instanceof com.example.drive_deal.entity.CompanyClientEntity) {
            com.example.drive_deal.entity.CompanyClientEntity company = 
                (com.example.drive_deal.entity.CompanyClientEntity) client;
            builder.append(renderer.renderField("companyId", "SIRET", company.getCompanyId()));
            builder.append(renderer.renderField("vatNumber", "Numéro TVA", company.getVatNumber()));
            
            if (includeCompanyDetails && company.getSubsidiaries() != null) {
                builder.append(renderer.renderField("subsidiaries", "Filiales", 
                    String.valueOf(company.getSubsidiaries().size())));
            }
        }
        
        return builder.toString();
    }
    
    @Override
    public String getTitle() {
        return client != null ? 
            "Formulaire Client - " + client.getName() : 
            "Nouveau Client";
    }
    
    @Override
    public String getFormType() {
        return "CLIENT";
    }
    
    public void setClient(ClientEntity client) {
        this.client = client;
    }
    
    public void setIncludeCompanyDetails(boolean include) {
        this.includeCompanyDetails = include;
    }
}