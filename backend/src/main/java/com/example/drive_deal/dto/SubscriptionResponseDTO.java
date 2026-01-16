package com.example.drive_deal.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class SubscriptionResponseDTO {
    private Long id;
    private Long clientId;
    private String clientEmail;
    private String subscriptionType;
    private boolean active;
    private LocalDateTime subscribedAt;
    private LocalDateTime unsubscribedAt;
    private Map<String, Object> preferences;
    private String message;
}