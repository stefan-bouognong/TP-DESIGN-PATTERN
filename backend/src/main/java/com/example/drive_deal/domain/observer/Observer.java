package com.example.drive_deal.domain.observer;


public interface Observer {
    void update(CatalogEvent event);
    String getObserverName();
    boolean isActive();
    void setActive(boolean active);
        } 
