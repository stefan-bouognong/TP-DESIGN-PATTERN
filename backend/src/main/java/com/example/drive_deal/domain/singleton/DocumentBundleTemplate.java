package com.example.drive_deal.domain.singleton;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.util.EnumMap;
import java.util.Map;

@Component
public class DocumentBundleTemplate {

    private static DocumentBundleTemplate instance;

    private final Map<DocumentType, DocumentTemplate> templates =
            new EnumMap<>(DocumentType.class);

    private DocumentBundleTemplate() {}

    public static synchronized DocumentBundleTemplate getInstance() {
        return instance;
    }

    @PostConstruct
    private void init() {
        instance = this;
        loadTemplates();
    }

    private void loadTemplates() {

        // ======= HEADER COMMUN =======
        final String companyHeader = """
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1a3e72; padding-bottom: 15px;">
                <h1 style="color: #1a3e72; margin: 0; font-size: 28px;">DriveDeal</h1>
                <p style="margin: 5px 0; color: #555;">Concessionnaire Automobile de Confiance</p>
                <p style="margin: 5px 0; color: #555;">123 Avenue des Libertés, Yaoundé, Cameroun</p>
                <p style="margin: 5px 0; color: #555;">Tél: +237 6 XX XX XX XX | Email: contact@drivedeal.cm</p>
            </div>
            """;

        // ==================== DEMANDE D'IMMATRICULATION ====================
        templates.put(DocumentType.REGISTRATION_REQUEST,
            new DocumentTemplate(
                DocumentType.REGISTRATION_REQUEST,
                "Demande d'Immatriculation",
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Demande d'Immatriculation</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
                        .info-block { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                        .label { font-weight: bold; color: #1a3e72; }
                        h1 { color: #1a3e72; border-bottom: 2px solid #1a3e72; padding-bottom: 10px; }
                    </style>
                </head>
                <body>
                    {{company_header}}
                    <h1>Demande d'Immatriculation</h1>
                    <div class="info-block">
                        <p><span class="label">Client :</span> {{client_name}}</p>
                        <p><span class="label">Adresse :</span> {{client_address}}</p>
                        <p><span class="label">Date de demande :</span> {{registration_date}}</p>
                    </div>
                    <h2>Détails du véhicule</h2>
                    <div class="info-block">
                        <p><span class="label">Modèle :</span> {{vehicle_model}}</p>
                        <p><span class="label">Numéro VIN :</span> {{vehicle_vin}}</p>
                        {{vehicle_type}}
                        {{engine_power}}
                        {{co2_emissions}}
                        {{requires_license}}
                        {{max_speed}}
                        {{has_top_case}}
                    </div>
                </body>
                </html>
                """
            )
        );

        // ==================== CERTIFICAT DE CESSION ====================
        templates.put(DocumentType.TRANSFER_CERTIFICATE,
            new DocumentTemplate(
                DocumentType.TRANSFER_CERTIFICATE,
                "Certificat de Cession",
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Certificat de Cession</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
                        .party { background: #f0f5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .label { font-weight: bold; color: #1a3e72; }
                        h1 { color: #1a3e72; }
                        .signature { margin-top: 60px; display: flex; justify-content: space-between; }
                    </style>
                </head>
                <body>
                    {{company_header}}
                    <h1 style="text-align: center;">Certificat de Cession de Véhicule</h1>
                    <p style="text-align: center; font-size: 14px;">Document officiel de transfert de propriété</p>

                    <h2>Vendeur</h2>
                    <div class="party">
                        <p><span class="label">Nom complet :</span> {{seller_name}}</p>
                        {{seller_address}}
                    </div>

                    <h2>Acheteur</h2>
                    <div class="party">
                        <p><span class="label">Nom complet :</span> {{buyer_name}}</p>
                        {{buyer_address}}
                    </div>

                    <h2>Détails du véhicule cédé</h2>
                    <div class="info-block">
                        {{vehicle_details}}
                        <p><span class="label">Date de première immatriculation :</span> {{first_registration}}</p>
                        <p><span class="label">Prix de cession :</span> <strong>{{sale_price}} FCFA</strong></p>
                        <p><span class="label">Date de cession :</span> {{sale_date}}</p>
                        {{vehicle_category}}
                        {{requires_helmet}}
                        {{doors}}
                        {{has_sunroof}}
                    </div>

                    <div class="signature">
                        <div>
                            <p>Signature du vendeur</p>
                            <p>________________________</p>
                        </div>
                        <div>
                            <p>Signature de l'acheteur</p>
                            <p>________________________</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
        );

        // ==================== BON DE COMMANDE ====================
        templates.put(DocumentType.ORDER_FORM,
            new DocumentTemplate(
                DocumentType.ORDER_FORM,
                "Bon de Commande",
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Bon de Commande</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                        h1 { color: #1a3e72; }
                        .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        .label { font-weight: bold; color: #1a3e72; }
                        .total { font-size: 20px; color: #d32f2f; font-weight: bold; text-align: right; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    {{company_header}}
                    <h1 style="text-align: center;">Bon de Commande</h1>
                    <p style="text-align: center;">N° {{order_id}} - Date : {{order_date}}</p>

                    <div class="info">
                        <p><span class="label">Client :</span> {{client_info}}</p>
                    </div>

                    <h2>Véhicules commandés</h2>
                    {{vehicle_list}}

                    {{vehicle_category}}
                    {{helmet_included}}

                    <p class="total">Montant total : {{total_amount}} FCFA</p>

                    <p style="margin-top: 50px;">Conditions générales de vente acceptées.</p>
                    <p style="text-align: right; margin-top: 40px;">Signature du client ________________________</p>
                </body>
                </html>
                """
            )
        );

        // ==================== FACTURE ====================
        templates.put(DocumentType.INVOICE,
            new DocumentTemplate(
                DocumentType.INVOICE,
                "Facture",
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Facture</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin: 25px 0; }
                        th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
                        th { background-color: #1a3e72; color: white; }
                        tr:nth-child(even) { background-color: #f8f9fa; }
                        .text-right { text-align: right; }
                        .grand-total { font-size: 18px; background-color: #1a3e72 !important; color: white; }
                        .header-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .billing { background: #f0f5ff; padding: 20px; border-radius: 8px; width: 45%; }
                        .label { font-weight: bold; color: #1a3e72; }
                    </style>
                </head>
                <body>
                    {{company_header}}
                    <div class="header-info">
                        <div>
                            <h1 style="color: #1a3e72; margin:0;">FACTURE</h1>
                            <p>N° {{invoice_number}}<br>Date : {{invoice_date}}</p>
                        </div>
                        <div class="billing">
                            <p><span class="label">Facturé à :</span></p>
                            {{billing_info}}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="text-right">Quantité</th>
                                <th class="text-right">Prix unitaire</th>
                                <th class="text-right">Montant HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{items_table}}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right">Sous-total HT :</td>
                                <td class="text-right">{{subtotal}} FCFA</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-right">TVA ({{tax_rate}}%) :</td>
                                <td class="text-right">{{taxes}} FCFA</td>
                            </tr>
                            <tr class="grand-total">
                                <td colspan="3" class="text-right"><strong>Total à payer :</strong></td>
                                <td class="text-right"><strong>{{total}} FCFA</strong></td>
                            </tr>
                        </tfoot>
                    </table>

                    <p><span class="label">Mode de paiement :</span> {{payment_method}}</p>
                    <p style="margin-top: 50px; font-style: italic;">Merci pour votre confiance. Paiement attendu sous 10 jours.</p>
                </body>
                </html>
                """
            )
        );
    }

    public DocumentTemplate getTemplate(DocumentType type) {
        DocumentTemplate template = templates.get(type);
        if (template == null) {
            throw new IllegalArgumentException(
                "Template non trouvé pour le type : " + type
            );
        }
        return template;
    }

    public Map<DocumentType, DocumentTemplate> getAllTemplates() {
        return new EnumMap<>(templates);
    }

    public void reloadTemplates() {
        templates.clear();
        loadTemplates();
    }
}
