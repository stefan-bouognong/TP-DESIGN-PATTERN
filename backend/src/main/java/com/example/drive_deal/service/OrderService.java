// OrderService.java
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

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final VehicleRepository vehicleRepository;
    private final OrderItemRepository orderItemRepository;
    private final CashOrderCreator cashOrderCreator;
    private final CreditOrderCreator creditOrderCreator;
    
    @Transactional
    public OrderResponseDTO createOrder(CreateOrderRequestDTO request) {
        // Vérifier le client
        ClientEntity client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));
        
        // Choisir la factory selon le type
        OrderCreator creator;
        switch (request.getOrderType().toUpperCase()) {
            case "CASH":
                creator = cashOrderCreator;
                break;
            case "CREDIT":
                creator = creditOrderCreator;
                break;
            default:
                throw new IllegalArgumentException("Invalid order type: " + request.getOrderType());
        }
        
        // Préparer la liste des véhicules pour la factory
        List<Map<String, Object>> vehicleRequests = new ArrayList<>();
        for (OrderItemRequestDTO item : request.getItems()) {
            Map<String, Object> map = new HashMap<>();
            map.put("vehicleId", item.getVehicleId());
            map.put("quantity", item.getQuantity());
            vehicleRequests.add(map);
        }
        
        // Utiliser Factory Method pour créer la commande
        Order order = creator.createOrder(client, vehicleRequests);
        
        // Récupérer l'entité et la sauvegarder
        OrderEntity entity;
        if (order instanceof CashOrder) {
            entity = ((CashOrder) order).getEntity();
        } else if (order instanceof CreditOrder) {
            entity = ((CreditOrder) order).getEntity();
            // Appliquer les détails crédit si fournis
            if (request.getCreditDetails() != null) {
                CreditOrderEntity creditEntity = (CreditOrderEntity) entity;
                creditEntity.setMonths(request.getCreditDetails().getMonths());
                creditEntity.setInterestRate(request.getCreditDetails().getInterestRate());
            }
        } else {
            throw new IllegalStateException("Unknown order type");
        }
        
        // Définir les adresses
        entity.setShippingAddress(request.getShippingAddress());
        entity.setBillingAddress(request.getBillingAddress() != null ? 
            request.getBillingAddress() : request.getShippingAddress());
        
        // Sauvegarder
        OrderEntity savedOrder = orderRepository.save(entity);
        
        // Retourner le DTO
        return mapToResponseDTO(savedOrder);
    }
    
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrder(Long id) {
        OrderEntity order = orderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        return mapToResponseDTO(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersByClient(Long clientId) {
        List<OrderEntity> orders = orderRepository.findByClientId(clientId);
        return orders.stream()
            .map(this::mapToResponseDTO)
            .toList();
    }
    
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, UpdateOrderStatusDTO request) {
        OrderEntity order = orderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        
        // Validation du changement de statut
        if (order.getStatus() == OrderStatus.DELIVERED && request.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Cannot change status from DELIVERED");
        }
        
        order.setStatus(request.getStatus());
        OrderEntity updated = orderRepository.save(order);
        
        return mapToResponseDTO(updated);
    }
    
    @Transactional
    public OrderResponseDTO approveCreditOrder(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        if (!(order instanceof CreditOrderEntity)) {
            throw new IllegalArgumentException("Order is not a credit order");
        }
        
        CreditOrderEntity creditOrder = (CreditOrderEntity) order;
        creditOrder.setApproved(true);
        creditOrder.setCreditStatus(CreditOrderEntity.CreditStatus.APPROVED);
        creditOrder.calculateSubtotal(); // Recalculer avec intérêts
        
        OrderEntity updated = orderRepository.save(creditOrder);
        return mapToResponseDTO(updated);
    }
    
    private OrderResponseDTO mapToResponseDTO(OrderEntity entity) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(entity.getId());
        dto.setClientId(entity.getClient().getId());
        dto.setClientName(entity.getClient().getName());
        dto.setOrderType(entity.getClass().getSimpleName().replace("Entity", "").replace("Order", ""));
        dto.setStatus(entity.getStatus());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setOrderDate(entity.getOrderDate());
        dto.setShippingAddress(entity.getShippingAddress());
        dto.setBillingAddress(entity.getBillingAddress());
        
        // Récupérer les items
        List<OrderItemResponseDTO> items = orderItemRepository.findByOrderId(entity.getId()).stream()
            .map(item -> {
                OrderItemResponseDTO itemDto = new OrderItemResponseDTO();
                itemDto.setId(item.getId());
                itemDto.setVehicleId(item.getVehicle().getId());
                itemDto.setVehicleModel(item.getVehicle().getModel());
                itemDto.setVehicleType(item.getVehicle().getClass().getSimpleName().replace("Entity", ""));
                itemDto.setQuantity(item.getQuantity());
                itemDto.setUnitPrice(item.getUnitPrice());
                itemDto.setSubTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                return itemDto;
            })
            .toList();
        dto.setItems(items);
        
        // Informations spécifiques au type
        if (entity instanceof CashOrderEntity) {
            CashOrderEntity cashOrder = (CashOrderEntity) entity;
            dto.setCashDiscount(cashOrder.getCashDiscount());
            dto.setPaid(cashOrder.getPaid());
        } else if (entity instanceof CreditOrderEntity) {
            CreditOrderEntity creditOrder = (CreditOrderEntity) entity;
            dto.setMonths(creditOrder.getMonths());
            dto.setInterestRate(creditOrder.getInterestRate());
            dto.setCreditStatus(creditOrder.getCreditStatus().toString());
            dto.setApproved(creditOrder.getApproved());
            
            // Calcul du paiement mensuel
            if (creditOrder.getApproved()) {
                BigDecimal monthlyRate = BigDecimal.valueOf(creditOrder.getInterestRate() / 12 / 100);
                BigDecimal numerator = entity.getTotalAmount().multiply(monthlyRate);
                BigDecimal denominator = BigDecimal.ONE.subtract(
                    BigDecimal.ONE.divide(BigDecimal.ONE.add(monthlyRate).pow(creditOrder.getMonths()), 10, BigDecimal.ROUND_HALF_UP));
                dto.setMonthlyPayment(numerator.divide(denominator, 2, BigDecimal.ROUND_HALF_UP));
            }
        }
        
        return dto;
    }
}