// CarDocumentBundleBuilder.java (Builder concret pour voitures)
package com.example.drive_deal.domain.builder;

import com.example.drive_deal.domain.singleton.DocumentBundleTemplate;
import com.example.drive_deal.domain.singleton.DocumentType;
import com.example.drive_deal.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CarDocumentBundleBuilder extends DocumentBundleBuilder {
    
    private final DocumentBundleTemplate documentBundleTemplate;
    private OrderEntity currentOrder;
    
    @Override
    public void createNewBundle(OrderEntity order) {
        super.createNewBundle(order);
        this.currentOrder = order;
        bundle.setBundleName("Car Document Bundle for Order #" + order.getId());
    }
    
    @Override
    public void buildRegistrationRequest() {
        DocumentEntity document = createDocument(DocumentType.REGISTRATION_REQUEST);
        
        // Données spécifiques aux voitures
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_type}}", "Automobile");
        data.put("{{engine_power}}", "150CV"); // Exemple
        data.put("{{co2_emissions}}", "120g/km"); // Exemple
        
        // Ajouter les données de base
        addBasicOrderData(data);
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.REGISTRATION_REQUEST)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    @Override
    public void buildTransferCertificate() {
        DocumentEntity document = createDocument(DocumentType.TRANSFER_CERTIFICATE);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_category}}", "M1"); // Catégorie M1 pour voitures
        data.put("{{first_registration}}", "2024-01-15"); // Exemple
        
        addBasicOrderData(data);
        
        // Pour les voitures, ajouter des infos techniques
        if (!currentOrder.getItems().isEmpty()) {
            OrderItemEntity item = currentOrder.getItems().get(0);
            if (item.getVehicle() instanceof CarEntity) {
                CarEntity car = (CarEntity) item.getVehicle();
                data.put("{{doors}}", car.getDoors().toString());
                data.put("{{has_sunroof}}", car.getHasSunroof() ? "Oui" : "Non");
            }
        }
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.TRANSFER_CERTIFICATE)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    @Override
    public void buildOrderForm() {
        DocumentEntity document = createDocument(DocumentType.ORDER_FORM);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_category}}", "Voiture");
        
        addBasicOrderData(data);
        
        // Construction de la liste des véhicules
        StringBuilder vehicleList = new StringBuilder("<ul>");
        for (OrderItemEntity item : currentOrder.getItems()) {
            vehicleList.append("<li>")
                .append(item.getVehicle().getModel())
                .append(" x").append(item.getQuantity())
                .append(" - ").append(item.getUnitPrice()).append("FCFA")
                .append("</li>");
        }
        vehicleList.append("</ul>");
        data.put("{{vehicle_list}}", vehicleList.toString());
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.ORDER_FORM)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    @Override
    public void buildInvoice() {
        DocumentEntity document = createDocument(DocumentType.INVOICE);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{document_type}}", "Facture Voiture");
        data.put("{{tax_rate}}", "20%"); // TVA standard
        
        addBasicOrderData(data);
        
        // Tableau des items pour la facture
        StringBuilder itemsTable = new StringBuilder();
        itemsTable.append("<table border='1'><tr><th>Véhicule</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr>");
        
        for (OrderItemEntity item : currentOrder.getItems()) {
            itemsTable.append("<tr>")
                .append("<td>").append(item.getVehicle().getModel()).append("</td>")
                .append("<td>").append(item.getQuantity()).append("</td>")
                .append("<td>").append(item.getUnitPrice()).append("FCFA</td>")
                .append("<td>").append(item.getUnitPrice().multiply(
                    new java.math.BigDecimal(item.getQuantity()))).append("FCFA</td>")
                .append("</tr>");
        }
        
        // Calculs
        itemsTable.append("</table>");
        data.put("{{items_table}}", itemsTable.toString());
        data.put("{{subtotal}}", currentOrder.getSubtotal().toString());
        
        // Calcul TVA (exemple: 20%)
        java.math.BigDecimal tax = currentOrder.getSubtotal()
            .multiply(new java.math.BigDecimal("0.20"));
        data.put("{{taxes}}", tax.toString());
        
        java.math.BigDecimal total = currentOrder.getSubtotal().add(tax);
        data.put("{{total}}", total.toString());
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.INVOICE)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    private DocumentEntity createDocument(DocumentType type) {
        DocumentEntity document = new DocumentEntity();
        document.setType(type);
        document.setTitle(documentBundleTemplate.getTemplate(type).getTitle() + 
            " - Order #" + currentOrder.getId());
        document.setFormat("HTML");
        document.setOrder(currentOrder);
        document.setClient(currentOrder.getClient());
        document.setFileName(type.name().toLowerCase() + "_order_" + currentOrder.getId() + ".html");
        return document;
    }
    
    private void addBasicOrderData(Map<String, String> data) {
        data.put("{{order_id}}", currentOrder.getId().toString());
        data.put("{{order_date}}", currentOrder.getOrderDate()
            .format(DateTimeFormatter.ISO_LOCAL_DATE));
        data.put("{{total_amount}}", currentOrder.getSubtotal().toString());
        
        ClientEntity client = currentOrder.getClient();
        data.put("{{client_name}}", client.getName());
        data.put("{{client_address}}", client.getAddress());
        data.put("{{client_email}}", client.getEmail());
        
        if (!currentOrder.getItems().isEmpty()) {
            OrderItemEntity item = currentOrder.getItems().get(0);
            data.put("{{vehicle_model}}", item.getVehicle().getModel());
            data.put("{{vehicle_price}}", item.getUnitPrice().toString());
        }
    }
}