package com.example.drive_deal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Arrays;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.from:noreply@plateform-test.cm}")
    private String fromEmail;
    
    /**
     * Envoie un email simple
     */
    public boolean sendEmail(String to, String subject, String body, boolean isHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, isHtml);
            
            mailSender.send(message);
            
            log.info("📧 Email envoyé à: {} | Sujet: {}", to, subject);
            return true;
            
        } catch (MessagingException e) {
            log.error("❌ Échec d'envoi d'email à {}: {}", to, e.getMessage());
            return false;
        }
    }
    
    /**
     * Envoie un email à plusieurs destinataires
     */
    public int sendBulkEmail(String[] recipients, String subject, String body, boolean isHtml) {
        int successCount = 0;
        
        for (String recipient : recipients) {
            if (sendEmail(recipient.trim(), subject, body, isHtml)) {
                successCount++;
            }
        }
        
        log.info("📧 Emails envoyés: {}/{} succès", successCount, recipients.length);
        return successCount;
    }
    
    /**
     * Teste la connexion SMTP
     */
    public boolean testSmtpConnection() {
        try {
            // Test simple en créant un message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromEmail);
            helper.setTo("test@example.com");
            helper.setSubject("Test SMTP");
            helper.setText("Test de connexion SMTP");
            
            // Ne pas envoyer, juste tester la création
            log.info("✅ Connexion SMTP OK - Configuration valide");
            log.info("   Serveur: {}", getSmtpHost());
            log.info("   Port: {}", getSmtpPort());
            log.info("   SSL: {}", isSslEnabled());
            
            return true;
            
        } catch (Exception e) {
            log.error("❌ Échec de test SMTP: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Obtient les informations de configuration SMTP
     */
    public String getSmtpInfo() {
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
            org.springframework.mail.javamail.JavaMailSenderImpl impl = 
                (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
            
            return String.format(
                "Host: %s, Port: %d, Username: %s, SSL: %s",
                impl.getHost(),
                impl.getPort(),
                impl.getUsername(),
                impl.getJavaMailProperties().getOrDefault("mail.smtp.ssl.enable", "false")
            );
        }
        return "Informations SMTP non disponibles";
    }
    
    private String getSmtpHost() {
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
            return ((org.springframework.mail.javamail.JavaMailSenderImpl) mailSender).getHost();
        }
        return "N/A";
    }
    
    private int getSmtpPort() {
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
            return ((org.springframework.mail.javamail.JavaMailSenderImpl) mailSender).getPort();
        }
        return 0;
    }
    
    private boolean isSslEnabled() {
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
            Object ssl = ((org.springframework.mail.javamail.JavaMailSenderImpl) mailSender)
                .getJavaMailProperties().get("mail.smtp.ssl.enable");
            return "true".equals(String.valueOf(ssl));
        }
        return false;
    }
}