package com.example.drive_deal.domain.observer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogEvent {
    private EventType type;
    private String message;
    private Map<String, Object> data = new HashMap<>();
    private LocalDateTime timestamp;
    private String source;
    
    public CatalogEvent(EventType type, String message) {
        this.type = type;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.source = "DriveDeal-System";
    }
    
    public CatalogEvent(EventType type, String message, Map<String, Object> data) {
        this.type = type;
        this.message = message;
        this.data = data != null ? data : new HashMap<>();
        this.timestamp = LocalDateTime.now();
        this.source = "DriveDeal-System";
    }
    
    public void addData(String key, Object value) {
        this.data.put(key, value);
    }
    
    public Object getData(String key) {
        return this.data.get(key);
    }
}