// DocumentTemplate.java (COMPLÈTE)
package com.example.drive_deal.domain.singleton;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
public class DocumentTemplate {
    private String id;
    private DocumentType type;
    private String title;
    private String content; // Template HTML/XML
    private Map<String, String> placeholders; // {{client_name}}, {{vehicle_model}}, etc.
    private LocalDateTime lastUpdated;
    
    public DocumentTemplate(DocumentType type, String title, String content) {
        this.id = type.name() + "_TEMPLATE";
        this.type = type;
        this.title = title;
        this.content = content;
        this.placeholders = new HashMap<>();
        this.lastUpdated = LocalDateTime.now();
        initializePlaceholders();
    }
    
    private void initializePlaceholders() {
        switch (type) {
            case REGISTRATION_REQUEST:
                // Placeholders de base
                placeholders.put("{{client_name}}", "");
                placeholders.put("{{client_address}}", "");
                placeholders.put("{{vehicle_model}}", "");
                placeholders.put("{{vehicle_vin}}", "");
                placeholders.put("{{registration_date}}", "");
                // Placeholders spécifiques véhicules
                placeholders.put("{{vehicle_type}}", "");
                placeholders.put("{{engine_power}}", "");
                placeholders.put("{{co2_emissions}}", "");
                placeholders.put("{{requires_license}}", "");
                placeholders.put("{{max_speed}}", "");
                placeholders.put("{{has_top_case}}", "");
                placeholders.put("{{doors}}", "");
                placeholders.put("{{has_sunroof}}", "");
                placeholders.put("{{vehicle_price}}", "");
                placeholders.put("{{client_email}}", "");
                break;
                
            case TRANSFER_CERTIFICATE:
                placeholders.put("{{seller_name}}", "");
                placeholders.put("{{buyer_name}}", "");
                placeholders.put("{{vehicle_details}}", "");
                placeholders.put("{{sale_price}}", "");
                placeholders.put("{{sale_date}}", "");
                placeholders.put("{{vehicle_category}}", "");
                placeholders.put("{{first_registration}}", "");
                placeholders.put("{{requires_helmet}}", "");
                placeholders.put("{{doors}}", "");
                placeholders.put("{{has_sunroof}}", "");
                placeholders.put("{{client_email}}", "");
                placeholders.put("{{vehicle_model}}", "");
                placeholders.put("{{vehicle_price}}", "");
                break;
                
            case ORDER_FORM:
                placeholders.put("{{order_id}}", "");
                placeholders.put("{{client_info}}", "");
                placeholders.put("{{vehicle_list}}", "");
                placeholders.put("{{total_amount}}", "");
                placeholders.put("{{order_date}}", "");
                placeholders.put("{{vehicle_category}}", "");
                placeholders.put("{{helmet_included}}", "");
                placeholders.put("{{client_name}}", "");
                placeholders.put("{{client_address}}", "");
                placeholders.put("{{client_email}}", "");
                placeholders.put("{{vehicle_model}}", "");
                break;
                
            case INVOICE:
                placeholders.put("{{invoice_number}}", "");
                placeholders.put("{{billing_info}}", "");
                placeholders.put("{{items_table}}", "");
                placeholders.put("{{subtotal}}", "");
                placeholders.put("{{taxes}}", "");
                placeholders.put("{{total}}", "");
                placeholders.put("{{document_type}}", "");
                placeholders.put("{{tax_rate}}", "");
                placeholders.put("{{invoice_date}}", "");
                placeholders.put("{{payment_method}}", "");
                placeholders.put("{{client_name}}", "");
                placeholders.put("{{client_address}}", "");
                placeholders.put("{{client_email}}", "");
                placeholders.put("{{order_id}}", "");
                placeholders.put("{{order_date}}", "");
                placeholders.put("{{vehicle_model}}", "");
                break;
        }
    }
    
    public String generateDocument(Map<String, String> data) {
        String generated = content;
        for (Map.Entry<String, String> entry : data.entrySet()) {
            generated = generated.replace(entry.getKey(), entry.getValue());
        }
        return generated;
    }
}