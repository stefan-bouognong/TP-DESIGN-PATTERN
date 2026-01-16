package com.example.drive_deal.domain.observer;

import java.util.List;

public interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers(CatalogEvent event);
    List<Observer> getObservers();
    void clearObservers();
    int getObserverCount();
}