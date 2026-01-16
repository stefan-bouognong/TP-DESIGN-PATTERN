// Order.java (interface du pattern)
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.OrderStatus;
import java.math.BigDecimal;
import java.util.List;

public interface Order {
    Long getId();
    String getOrderType();
    OrderStatus getStatus();
    BigDecimal getTotalAmount();
    int getItemCount();
    List<OrderItem> getItems();
    void addItem(OrderItem item);
    void calculateTotal();
    void setStatus(OrderStatus status);
}