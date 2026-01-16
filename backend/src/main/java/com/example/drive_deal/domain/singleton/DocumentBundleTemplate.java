// DocumentBundleTemplate.java (LE SINGLETON)
package com.example.drive_deal.domain.singleton;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.util.EnumMap;
import java.util.Map;

@Component
public class DocumentBundleTemplate {
    
    // Instance unique
    private static DocumentBundleTemplate instance;
    
    // Templates par type
    private final Map<DocumentType, DocumentTemplate> templates = new EnumMap<>(DocumentType.class);
    
    // Constructeur privé
    private DocumentBundleTemplate() {
        // Empêche l'instanciation externe
    }
    
    // Méthode d'accès statique (pattern Singleton classique)
    public static synchronized DocumentBundleTemplate getInstance() {
        if (instance == null) {
            instance = new DocumentBundleTemplate();
        }
        return instance;
    }
    
    // Initialisation Spring (alternative)
    @PostConstruct
    private void init() {
        // Si on utilise l'injection Spring, cette méthode initialise l'instance
        instance = this;
        loadTemplates();
    }
    
private void loadTemplates() {
    templates.put(DocumentType.REGISTRATION_REQUEST, 
        new DocumentTemplate(
            DocumentType.REGISTRATION_REQUEST,
            "Demande d'Immatriculation",
            """
            <!DOCTYPE html>
            <html>
            <head><title>Demande d'Immatriculation</title></head>
            <body>
                <h1>Demande d'Immatriculation</h1>
                <p><strong>Client:</strong> {{client_name}}</p>
                <p><strong>Adresse:</strong> {{client_address}}</p>
                <p><strong>Véhicule:</strong> {{vehicle_model}}</p>
                <p><strong>VIN:</strong> {{vehicle_vin}}</p>
                <p><strong>Date:</strong> {{registration_date}}</p>
                {{vehicle_type}}
                {{engine_power}}
                {{co2_emissions}}
                {{requires_license}}
                {{max_speed}}
                {{has_top_case}}
            </body>
            </html>
            """
        ));
    
    templates.put(DocumentType.TRANSFER_CERTIFICATE,
        new DocumentTemplate(
            DocumentType.TRANSFER_CERTIFICATE,
            "Certificat de Cession",
            """
            <!DOCTYPE html>
            <html>
            <head><title>Certificat de Cession</title></head>
            <body>
                <h1>Certificat de Cession de Véhicule</h1>
                <p><strong>Vendeur:</strong> {{seller_name}}</p>
                <p><strong>Acheteur:</strong> {{buyer_name}}</p>
                <p><strong>Détails du véhicule:</strong> {{vehicle_details}}</p>
                <p><strong>Prix de vente:</strong> {{sale_price}} FCFA</p>
                <p><strong>Date de vente:</strong> {{sale_date}}</p>
                {{vehicle_category}}
                {{first_registration}}
                {{requires_helmet}}
                {{doors}}
                {{has_sunroof}}
            </body>
            </html>
            """
        ));
    
    templates.put(DocumentType.ORDER_FORM,
        new DocumentTemplate(
            DocumentType.ORDER_FORM,
            "Bon de Commande",
            """
            <!DOCTYPE html>
            <html>
            <head><title>Bon de Commande</title></head>
            <body>
                <h1>Bon de Commande DriveDeal</h1>
                <p><strong>N° Commande:</strong> {{order_id}}</p>
                <p><strong>Client:</strong> {{client_info}}</p>
                <p><strong>Véhicules commandés:</strong></p>
                {{vehicle_list}}
                <p><strong>Montant total:</strong> {{total_amount}} FCFA</p>
                <p><strong>Date de commande:</strong> {{order_date}}</p>
                {{vehicle_category}}
                {{helmet_included}}
            </body>
            </html>
            """
        ));
    
    // AJOUT DU TEMPLATE INVOICE MANQUANT
    templates.put(DocumentType.INVOICE,
        new DocumentTemplate(
            DocumentType.INVOICE,
            "Facture",
            """
            <!DOCTYPE html>
            <html>
            <head><title>Facture</title></head>
            <body>
                <h1>Facture DriveDeal</h1>
                <p><strong>Type:</strong> {{document_type}}</p>
                <p><strong>N° Facture:</strong> {{invoice_number}}</p>
                <p><strong>Client:</strong> {{billing_info}}</p>
                <p><strong>Date:</strong> {{invoice_date}}</p>
                <h3>Détails des articles:</h3>
                {{items_table}}
                <p><strong>Sous-total:</strong> {{subtotal}} FCFA</p>
                <p><strong>TVA ({{tax_rate}}):</strong> {{taxes}} FCFA</p>
                <h3><strong>Total à payer:</strong> {{total}} FCFA</h3>
                <p><strong>Mode de paiement:</strong> {{payment_method}}</p>
            </body>
            </html>
            """
        ));
}
    
    // Méthodes d'accès
    public DocumentTemplate getTemplate(DocumentType type) {
        DocumentTemplate template = templates.get(type);
        if (template == null) {
            throw new IllegalArgumentException("Template not found for type: " + type);
        }
        return template;
    }
    
    public Map<DocumentType, DocumentTemplate> getAllTemplates() {
        return new EnumMap<>(templates);
    }
    
    // Pour réinitialiser (utile pour les tests)
    public void reloadTemplates() {
        templates.clear();
        loadTemplates();
    }
}