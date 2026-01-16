// OrderController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.*;
import com.example.drive_deal.service.OrderService;
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
    
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO response = orderService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long id) {
        OrderResponseDTO response = orderService.getOrder(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByClient(@PathVariable Long clientId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByClient(clientId);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusDTO request) {
        OrderResponseDTO response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/approve-credit")
    public ResponseEntity<OrderResponseDTO> approveCreditOrder(@PathVariable Long id) {
        OrderResponseDTO response = orderService.approveCreditOrder(id);
        return ResponseEntity.ok(response);
    }
}