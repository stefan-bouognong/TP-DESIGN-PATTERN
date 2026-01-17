// VehicleEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_type", discriminatorType = DiscriminatorType.STRING)
public abstract class VehicleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          //  AJOUTÉ
    private String model;
    private String brand;         // (souvent utile)
    private BigDecimal price;
    private String color;
    private Integer year;

    private boolean available;    // utile pour ton filtre
    private boolean onSale;       // utile pour ton filtre

    @Column(length = 1000)
    private String description;   // utile pour ton filtre

    // =======================
    // GETTERS / SETTERS
    // =======================
    @Transient
    public String getType() {
        return this.getClass().getSimpleName().replace("Entity", "").toUpperCase();
    }



        @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
     @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;



    public String getImageUrl() {
    return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }



    // getters
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }          
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) {
    this.brand = brand;
}

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public boolean isOnSale() { return onSale; }
    public void setOnSale(boolean onSale) { this.onSale = onSale; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
