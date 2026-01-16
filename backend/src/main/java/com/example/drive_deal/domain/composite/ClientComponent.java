// ClientComponent.java (interface du pattern)
package com.example.drive_deal.domain.composite;

public interface ClientComponent {
    Long getId();
    String getName();
    String getEmail();
    String getType(); // "INDIVIDUAL" ou "COMPANY"
    void displayInfo(int depth);
    double calculateFleetDiscount(); // Pour les achats de flotte
}