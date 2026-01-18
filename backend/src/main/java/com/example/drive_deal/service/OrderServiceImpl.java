package com.example.drive_deal.service;

import com.example.drive_deal.domain.factorymethod.*;
import com.example.drive_deal.dto.*;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.entity.CreditOrderEntity.CreditStatus;
import com.example.drive_deal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderServiceI {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    // Ajoute ici ton FactoryMethod si nécessaire

    @Override
    public OrderResponseDTO createOrder(CreateOrderRequestDTO request) {
        // TODO: implémenter la création d'une commande
        return null;
    }

    @Override
    public OrderResponseDTO getOrder(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable : " + id));
        return mapToDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByClient(Long clientId) {
        List<OrderEntity> orders = orderRepository.findByClientId(clientId);
        return orders.stream().map(this::mapToDTO).toList();
    }

    @Override
    public OrderResponseDTO updateOrderStatus(Long id, UpdateOrderStatusDTO request) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable : " + id));
        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return mapToDTO(order);
    }

    @Override
    public OrderResponseDTO approveCreditOrder(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable : " + id));
        if (order instanceof CreditOrderEntity creditOrder) {
            creditOrder.setApproved(true);
            creditOrder.setCreditStatus(CreditStatus.APPROVED);
            // Calcul du paiement mensuel si nécessaire
            orderRepository.save(order);
            return mapToDTO(order);
        } else {
            throw new RuntimeException("Cette commande n'est pas un crédit : " + id);
        }
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<OrderEntity> orders = orderRepository.findAll(); // récupère toutes les commandes
        return orders.stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<OrderResponseDTO> getCashOrders() {
        List<OrderEntity> orders = orderRepository.findAllCashOrders();
        return orders.stream().map(this::mapToDTO).toList();
    }

    @Override
    public List<OrderResponseDTO> getCreditOrders() {
        List<OrderEntity> orders = orderRepository.findAllCreditOrders();
        return orders.stream().map(this::mapToDTO).toList();
    }

    @Override
    public Long countOrdersByClient(Long clientId) {
        return orderRepository.countByClientId(clientId);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<OrderEntity> orders = orderRepository.findByStatus(status);
        return orders.stream().map(this::mapToDTO).toList();
    }

    // ─────────────── Mapping Entity → DTO ───────────────
    private OrderResponseDTO mapToDTO(OrderEntity order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setClientId(order.getClient().getId());
        // dto.setClientName(order.getClient().getFullName());
        // dto.setOrderType(order.getOrderType().name());
        dto.setStatus(order.getStatus().name());
        dto.setSubtotal(order.getSubtotal());
        // dto.setOrderDate(order.getOrderDate().toString());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setBillingAddress(order.getBillingAddress());

        dto.setItems(order.getItems().stream().map(item -> {
            OrderItemResponseDTO i = new OrderItemResponseDTO();
            i.setId(item.getId());
            i.setVehicleId(item.getVehicle().getId());
            i.setVehicleModel(item.getVehicle().getModel());
            i.setVehicleType(item.getVehicle().getType());
            i.setQuantity(item.getQuantity());
            i.setUnitPrice(item.getUnitPrice());
            // i.setSubTotal(item.getSubTotal());
            return i;
        }).toList());

        // Pour les crédits
        if (order instanceof CreditOrderEntity credit) {
            dto.setMonths(credit.getMonths());
            dto.setInterestRate(credit.getInterestRate());
            dto.setCreditStatus(credit.getCreditStatus().name());
            // dto.setApproved(credit.isApproved());
            // dto.setMonthlyPayment(credit.getMonthlyPayment());
        }

        return dto;
    }
}
