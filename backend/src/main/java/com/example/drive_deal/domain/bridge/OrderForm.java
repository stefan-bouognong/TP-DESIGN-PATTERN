// OrderForm.java (RefinedAbstraction - Formulaire commande)
package com.example.drive_deal.domain.bridge;

import com.example.drive_deal.entity.OrderEntity;
import com.example.drive_deal.entity.OrderItemEntity;
import lombok.Getter;

@Getter
public class OrderForm extends Form {
    
    private OrderEntity order;
    private boolean includeItemsDetails = true;
    private boolean includeFinancialDetails = true;
    
    public OrderForm(FormRenderer renderer, OrderEntity order) {
        super(renderer);
        this.order = order;
    }
    
    public OrderForm(FormRenderer renderer) {
        super(renderer);
    }
    
    @Override
    public String render() {
        StringBuilder builder = new StringBuilder();
        
        // Informations de base
        builder.append(renderer.renderField("orderId", "N° Commande", order.getId().toString()));
        builder.append(renderer.renderField("status", "Statut", order.getStatus().toString()));
        builder.append(renderer.renderField("orderDate", "Date", order.getOrderDate().toString()));
        builder.append(renderer.renderField("client", "Client", order.getClient().getName()));
        
        // Détails des articles
        if (includeItemsDetails && order.getItems() != null && !order.getItems().isEmpty()) {
            builder.append(renderer.renderSection("Articles commandés"));
            
            for (OrderItemEntity item : order.getItems()) {
                String itemLabel = item.getVehicle().getModel() + " x" + item.getQuantity();
                String itemValue = item.getUnitPrice() + " FCFA (Total: " + 
                    item.getUnitPrice().multiply(new java.math.BigDecimal(item.getQuantity())) + " FCFA)";
                builder.append(renderer.renderField("item_" + item.getId(), itemLabel, itemValue));
            }
        }
        
        // Détails financiers
        if (includeFinancialDetails) {
            builder.append(renderer.renderSection("Détails financiers"));
            builder.append(renderer.renderField("totalAmount", "Montant total", 
                order.getSubtotal() + " FCFA"));
            
            // Informations spécifiques au type de commande
            if (order instanceof com.example.drive_deal.entity.CashOrderEntity) {
                com.example.drive_deal.entity.CashOrderEntity cashOrder = 
                    (com.example.drive_deal.entity.CashOrderEntity) order;
                builder.append(renderer.renderField("cashDiscount", "Réduction", 
                    cashOrder.getCashDiscount() + " %"));
                builder.append(renderer.renderField("paid", "Payé", 
                    cashOrder.getPaid() ? "Oui" : "Non"));
            } 
            else if (order instanceof com.example.drive_deal.entity.CreditOrderEntity) {
                com.example.drive_deal.entity.CreditOrderEntity creditOrder = 
                    (com.example.drive_deal.entity.CreditOrderEntity) order;
                builder.append(renderer.renderField("months", "Durée crédit", 
                    creditOrder.getMonths() + " mois"));
                builder.append(renderer.renderField("interestRate", "Taux intérêt", 
                    creditOrder.getInterestRate() + " %"));
                builder.append(renderer.renderField("approved", "Approuvé", 
                    creditOrder.getApproved() ? "Oui" : "Non"));
            }
        }
        
        // Adresses
        builder.append(renderer.renderSection("Adresses"));
        builder.append(renderer.renderField("shipping", "Livraison", order.getShippingAddress()));
        if (order.getBillingAddress() != null && !order.getBillingAddress().equals(order.getShippingAddress())) {
            builder.append(renderer.renderField("billing", "Facturation", order.getBillingAddress()));
        }
        
        return builder.toString();
    }
    
    @Override
    public String getTitle() {
        return order != null ? 
            "Formulaire Commande - #" + order.getId() : 
            "Nouvelle Commande";
    }
    
    @Override
    public String getFormType() {
        return "ORDER";
    }
    
    public void setOrder(OrderEntity order) {
        this.order = order;
    }
    
    public void setIncludeItemsDetails(boolean include) {
        this.includeItemsDetails = include;
    }
    
    public void setIncludeFinancialDetails(boolean include) {
        this.includeFinancialDetails = include;
    }
}