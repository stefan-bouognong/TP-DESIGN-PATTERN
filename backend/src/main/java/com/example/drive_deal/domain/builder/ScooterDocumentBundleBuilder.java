// ScooterDocumentBundleBuilder.java (Builder concret pour scooters)
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
public class ScooterDocumentBundleBuilder extends DocumentBundleBuilder {
    
    private final DocumentBundleTemplate documentBundleTemplate;
    private OrderEntity currentOrder;
    
    @Override
    public void createNewBundle(OrderEntity order) {
        super.createNewBundle(order);
        this.currentOrder = order;
        bundle.setBundleName("Scooter Document Bundle for Order #" + order.getId());
    }
    
    @Override
    public void buildRegistrationRequest() {
        DocumentEntity document = createDocument(DocumentType.REGISTRATION_REQUEST);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_type}}", "Scooter/Deux-roues");
        data.put("{{engine_power}}", "125cc"); // Exemple pour scooter
        data.put("{{requires_license}}", "Permis A1/A2 requis");
        
        addBasicOrderData(data);
        
        // Infos spécifiques scooter
        if (!currentOrder.getItems().isEmpty()) {
            OrderItemEntity item = currentOrder.getItems().get(0);
            if (item.getVehicle() instanceof ScooterEntity) {
                ScooterEntity scooter = (ScooterEntity) item.getVehicle();
                data.put("{{max_speed}}", scooter.getMaxSpeed() + " km/h");
                data.put("{{has_top_case}}", scooter.getHasTopCase() ? "Avec top-case" : "Sans top-case");
            }
        }
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.REGISTRATION_REQUEST)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    @Override
    public void buildTransferCertificate() {
        DocumentEntity document = createDocument(DocumentType.TRANSFER_CERTIFICATE);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_category}}", "L"); // Catégorie L pour deux-roues
        data.put("{{requires_helmet}}", "Oui, casque homologué obligatoire");
        
        addBasicOrderData(data);
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.TRANSFER_CERTIFICATE)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    @Override
    public void buildOrderForm() {
        DocumentEntity document = createDocument(DocumentType.ORDER_FORM);
        
        Map<String, String> data = new HashMap<>();
        data.put("{{vehicle_category}}", "Scooter/Deux-roues");
        data.put("{{helmet_included}}", "Non inclus"); // Optionnel
        
        addBasicOrderData(data);
        
        StringBuilder vehicleList = new StringBuilder("<ul>");
        for (OrderItemEntity item : currentOrder.getItems()) {
            String vehicleInfo = item.getVehicle().getModel();
            if (item.getVehicle() instanceof ScooterEntity) {
                ScooterEntity scooter = (ScooterEntity) item.getVehicle();
                vehicleInfo += " (Vitesse max: " + scooter.getMaxSpeed() + " km/h)";
            }
            vehicleList.append("<li>")
                .append(vehicleInfo)
                .append(" x").append(item.getQuantity())
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
        data.put("{{document_type}}", "Facture Scooter");
        data.put("{{tax_rate}}", "10%"); // TVA réduite pour certains deux-roues
        
        addBasicOrderData(data);
        
        StringBuilder itemsTable = new StringBuilder();
        itemsTable.append("<table border='1'><tr><th>Scooter</th><th>Qté</th><th>Prix</th><th>Total</th></tr>");
        
        for (OrderItemEntity item : currentOrder.getItems()) {
            String model = item.getVehicle().getModel();
            if (item.getVehicle() instanceof ScooterEntity) {
                ScooterEntity scooter = (ScooterEntity) item.getVehicle();
                model += " (" + scooter.getMaxSpeed() + " km/h)";
            }
            
            itemsTable.append("<tr>")
                .append("<td>").append(model).append("</td>")
                .append("<td>").append(item.getQuantity()).append("</td>")
                .append("<td>").append(item.getUnitPrice()).append("€</td>")
                .append("<td>").append(item.getUnitPrice().multiply(
                    new java.math.BigDecimal(item.getQuantity()))).append("€</td>")
                .append("</tr>");
        }
        
        itemsTable.append("</table>");
        data.put("{{items_table}}", itemsTable.toString());
        data.put("{{subtotal}}", currentOrder.getTotalAmount().toString());
        
        // TVA réduite pour scooters (exemple: 10%)
        java.math.BigDecimal tax = currentOrder.getTotalAmount()
            .multiply(new java.math.BigDecimal("0.10"));
        data.put("{{taxes}}", tax.toString());
        
        java.math.BigDecimal total = currentOrder.getTotalAmount().add(tax);
        data.put("{{total}}", total.toString());
        
        document.setContent(documentBundleTemplate.getTemplate(DocumentType.INVOICE)
            .generateDocument(data));
        
        bundle.addDocument(document);
    }
    
    private DocumentEntity createDocument(DocumentType type) {
        DocumentEntity document = new DocumentEntity();
        document.setType(type);
        document.setTitle(documentBundleTemplate.getTemplate(type).getTitle() + 
            " - Scooter Order #" + currentOrder.getId());
        document.setFormat("HTML");
        document.setOrder(currentOrder);
        document.setClient(currentOrder.getClient());
        document.setFileName("scooter_" + type.name().toLowerCase() + "_" + currentOrder.getId() + ".html");
        return document;
    }
    
    private void addBasicOrderData(Map<String, String> data) {
        data.put("{{order_id}}", currentOrder.getId().toString());
        data.put("{{order_date}}", currentOrder.getOrderDate()
            .format(DateTimeFormatter.ISO_LOCAL_DATE));
        data.put("{{total_amount}}", currentOrder.getTotalAmount().toString());
        
        ClientEntity client = currentOrder.getClient();
        data.put("{{client_name}}", client.getName());
        data.put("{{client_address}}", client.getAddress());
        data.put("{{client_email}}", client.getEmail());
    }
}