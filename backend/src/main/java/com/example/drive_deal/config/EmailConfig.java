package com.example.drive_deal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // Configuration SMTP avec port 465 (SSL) ou 5487
        mailSender.setHost("mail.nucle-x.work");
        mailSender.setPort(465); // Port SSL recommandé
        // mailSender.setPort(5487); // Alternative si SSL ne fonctionne pas
        
        mailSender.setUsername("noreply");
        mailSender.setPassword("Noreply@123");
        
        // Propriétés Jakarta Mail
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.enable", "true"); // SSL activé pour le port 465
        
        // Pour le port 5487 (sans SSL), utiliser :
        // props.put("mail.smtp.ssl.enable", "false");
        
        props.put("mail.smtp.ssl.trust", "mail.nucle-x.work");
        props.put("mail.debug", "true");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");
        
        return mailSender;
    }
    
    @Bean
    public String emailFrom() {
        return "noreply@plateform-test.cm";
    }
}