// OrderController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.*;
import com.example.drive_deal.entity.OrderStatus;
import com.example.drive_deal.service.OrderService;
import com.example.drive_deal.service.OrderServiceI;
import com.example.drive_deal.service.OrderServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderServiceImpl orderServiceI;

    // Créer une commande
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO response = orderService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Récupérer une commande par ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long id) {
        OrderResponseDTO response = orderService.getOrder(id);
        return ResponseEntity.ok(response);
    }

    // Récupérer toutes les commandes d’un client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByClient(@PathVariable Long clientId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByClient(clientId);
        return ResponseEntity.ok(orders);
    }

    // Mettre à jour le statut d’une commande
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusDTO request) {
        OrderResponseDTO response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // Approuver une commande crédit
    @PostMapping("/{id}/approve-credit")
    public ResponseEntity<OrderResponseDTO> approveCreditOrder(@PathVariable Long id) {
        OrderResponseDTO response = orderService.approveCreditOrder(id);
        return ResponseEntity.ok(response);
    }

    // Lister toutes les commandes (optionnel : pour admin)
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders = orderServiceI.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Lister uniquement les commandes cash
    @GetMapping("/cash")
    public ResponseEntity<List<OrderResponseDTO>> getCashOrders() {
        List<OrderResponseDTO> orders = orderServiceI.getCashOrders();
        return ResponseEntity.ok(orders);
    }

    // Lister uniquement les commandes crédit
    @GetMapping("/credit")
    public ResponseEntity<List<OrderResponseDTO>> getCreditOrders() {
        List<OrderResponseDTO> orders = orderServiceI.getCreditOrders();
        return ResponseEntity.ok(orders);
    }

    // Compter le nombre de commandes d’un client
    @GetMapping("/count/client/{clientId}")
    public ResponseEntity<Long> countOrdersByClient(@PathVariable Long clientId) {
        Long count = orderServiceI.countOrdersByClient(clientId);
        return ResponseEntity.ok(count);
    }

    // Filtrer par statut (optionnel)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderResponseDTO> orders = orderServiceI.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
}
