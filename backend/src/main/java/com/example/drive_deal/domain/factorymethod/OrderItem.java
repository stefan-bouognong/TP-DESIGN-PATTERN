// OrderItem.java
package com.example.drive_deal.domain.factorymethod;

import java.math.BigDecimal;

public interface OrderItem {
    Long getId();
    Long getVehicleId();
    String getVehicleModel();
    Integer getQuantity();
    BigDecimal getUnitPrice();
    BigDecimal getSubTotal();
}