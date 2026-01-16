package com.example.drive_deal.domain.observer;

import com.example.drive_deal.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class EmailNotificationObserver implements Observer {
    
    private final NotificationService notificationService;
    private final CatalogSubject catalogSubject;
    
    @Value("${app.notification.email.enabled:true}")
    private boolean enabled;
    
    @Value("${app.notification.email.recipients:admin@example.com}")
    private String defaultRecipients;
    
    private List<EventType> subscribedEvents = Arrays.asList(
        EventType.VEHICLE_ADDED,
        EventType.VEHICLE_ON_SALE,
        EventType.ORDER_CREATED,
        EventType.ORDER_DELIVERED,
        EventType.CLIENT_REGISTERED,
        EventType.SYSTEM_ERROR
    );
    
    private boolean active = true;
    
    @Autowired
    public EmailNotificationObserver(NotificationService notificationService,
                                   CatalogSubject catalogSubject) {
        this.notificationService = notificationService;
        this.catalogSubject = catalogSubject;
    }
    
    @PostConstruct
    public void init() {
        if (enabled) {
            catalogSubject.registerObserver(this);
            log.info("EmailNotificationObserver initialisé et activé");
        } else {
            log.info("EmailNotificationObserver désactivé par configuration");
        }
    }
    
    @Override
    public void update(CatalogEvent event) {
        if (!active || !enabled || !subscribedEvents.contains(event.getType())) {
            return;
        }
        
        try {
            String subject = buildEmailSubject(event);
            String body = buildEmailBody(event);
            
            // Envoyer aux destinataires configurés
            String[] recipients = defaultRecipients.split(",");
            for (String recipient : recipients) {
                String email = recipient.trim();
                if (!email.isEmpty()) {
                    notificationService.sendEmail(email, subject, body, true);
                }
            }
            
            log.debug("Email envoyé pour l'événement: {}", event.getType());
            
        } catch (Exception e) {
            log.error("Échec d'envoi d'email pour l'événement {}: {}", 
                     event.getType(), e.getMessage(), e);
        }
    }
    
    private String buildEmailSubject(CatalogEvent event) {
        String prefix = "[DriveDeal] ";
        
        switch (event.getType()) {
            case VEHICLE_ADDED:
                return prefix + "Nouveau véhicule - " + event.getData("vehicleName");
                
            case VEHICLE_ON_SALE:
                return prefix + "PROMOTION - " + event.getData("vehicleName");
                
            case ORDER_CREATED:
                return prefix + "Nouvelle commande #" + event.getData("orderId");
                
            case ORDER_DELIVERED:
                return prefix + "Commande livrée #" + event.getData("orderId");
                
            case CLIENT_REGISTERED:
                return prefix + "Nouveau client inscrit";
                
            case SYSTEM_ERROR:
                return prefix + "ALERTE SYSTÈME - Erreur détectée";
                
            default:
                return prefix + "Notification - " + event.getType();
        }
    }
    
    private String buildEmailBody(CatalogEvent event) {
        StringBuilder html = new StringBuilder();
        html.append("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2c3e50; color: white; padding: 15px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .footer { margin-top: 20px; padding: 10px; text-align: center; color: #777; font-size: 12px; }
                    .event-details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
                    .alert { color: #e74c3c; font-weight: bold; }
                    .success { color: #27ae60; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>DriveDeal - Notification</h2>
                    </div>
                    <div class="content">
            """);
        
        // Contenu spécifique à l'événement
        html.append("<h3>").append(event.getMessage()).append("</h3>");
        html.append("<div class='event-details'>");
        
        switch (event.getType()) {
            case VEHICLE_ADDED:
                html.append("<p><strong>Véhicule:</strong> ").append(event.getData("vehicleName")).append("</p>");
                html.append("<p><strong>ID:</strong> ").append(event.getData("vehicleId")).append("</p>");
                if (event.getData("price") != null) {
                    html.append("<p><strong>Prix:</strong> ").append(event.getData("price")).append(" FCFA</p>");
                }
                break;
                
            case VEHICLE_ON_SALE:
                html.append("<p class='alert'>🚨 VÉHICULE EN PROMOTION !</p>");
                html.append("<p><strong>Véhicule:</strong> ").append(event.getData("vehicleName")).append("</p>");
                html.append("<p><strong>ID:</strong> ").append(event.getData("vehicleId")).append("</p>");
                break;
                
            case ORDER_CREATED:
                html.append("<p class='success'>✅ NOUVELLE COMMANDE</p>");
                html.append("<p><strong>Commande #:</strong> ").append(event.getData("orderId")).append("</p>");
                html.append("<p><strong>Client:</strong> ").append(event.getData("customerEmail")).append("</p>");
                if (event.getData("amount") != null) {
                    html.append("<p><strong>Montant:</strong> ").append(event.getData("amount")).append(" FCFA</p>");
                }
                break;
                
            case SYSTEM_ERROR:
                html.append("<p class='alert'>❌ ERREUR SYSTÈME</p>");
                html.append("<p><strong>Message:</strong> ").append(event.getMessage()).append("</p>");
                break;
        }
        
        // Données générales
        html.append("<hr>");
        html.append("<p><small><strong>Type:</strong> ").append(event.getType()).append("</small></p>");
        html.append("<p><small><strong>Source:</strong> ").append(event.getSource()).append("</small></p>");
        html.append("<p><small><strong>Date:</strong> ").append(event.getTimestamp()).append("</small></p>");
        
        html.append("""
                    </div>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé automatiquement par le système DriveDeal.</p>
                    <p>© 2024 DriveDeal - Tous droits réservés</p>
                </div>
            </div>
            </body>
            </html>
            """);
        
        return html.toString();
    }
    
    @Override
    public String getObserverName() {
        return "EmailNotificationObserver";
    }
    
    @Override
    public boolean isActive() {
        return active && enabled;
    }
    
    @Override
    public void setActive(boolean active) {
        this.active = active;
        log.info("EmailNotificationObserver {}", active ? "activé" : "désactivé");
    }
}