// DocumentBundleBuilder.java (Builder abstrait)
package com.example.drive_deal.domain.builder;

import com.example.drive_deal.entity.OrderEntity;
import org.springframework.stereotype.Component;

@Component
public abstract class DocumentBundleBuilder {
    protected DocumentBundle bundle;
    
    public void createNewBundle(OrderEntity order) {
        bundle = new DocumentBundle();
        bundle.setOrderId(order.getId());
        bundle.setClientId(order.getClient().getId());
        bundle.setBundleName("Bundle for Order #" + order.getId());
    }
    
    public DocumentBundle getBundle() {
        return bundle;
    }
    
    // Étapes de construction
    public abstract void buildRegistrationRequest();
    public abstract void buildTransferCertificate();
    public abstract void buildOrderForm();
    public abstract void buildInvoice();
    
    // Méthode template optionnelle
    public void buildCompleteBundle() {
        buildRegistrationRequest();
        buildTransferCertificate();
        buildOrderForm();
        buildInvoice();
        bundle.setCompleted(true);
    }
}