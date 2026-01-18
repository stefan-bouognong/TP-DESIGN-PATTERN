package com.example.drive_deal.service;

import com.example.drive_deal.domain.factorymethod.*;
import com.example.drive_deal.dto.*;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface OrderServiceI {

    OrderResponseDTO createOrder(CreateOrderRequestDTO request);

    OrderResponseDTO getOrder(Long id);

    List<OrderResponseDTO> getOrdersByClient(Long clientId);

    OrderResponseDTO updateOrderStatus(Long id, UpdateOrderStatusDTO request);

    OrderResponseDTO approveCreditOrder(Long id);

    List<OrderResponseDTO> getAllOrders();

    List<OrderResponseDTO> getCashOrders();

    List<OrderResponseDTO> getCreditOrders();

    Long countOrdersByClient(Long clientId);

    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);
}
