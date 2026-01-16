// DocumentService.java
package com.example.drive_deal.service;

import com.example.drive_deal.domain.singleton.DocumentBundleTemplate;
import com.example.drive_deal.domain.singleton.DocumentTemplate;
import com.example.drive_deal.domain.singleton.DocumentType;
import com.example.drive_deal.dto.DocumentResponseDTO;
import com.example.drive_deal.dto.DocumentTemplateDTO;
import com.example.drive_deal.dto.GenerateDocumentRequestDTO;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentService {
    
    private final DocumentRepository documentRepository;
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final VehicleRepository vehicleRepository;
    private final DocumentBundleTemplate documentBundleTemplate;
    
    @Transactional
    public DocumentResponseDTO generateDocument(GenerateDocumentRequestDTO request) {
        // Récupérer la commande
        OrderEntity order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + request.getOrderId()));
        
        // Récupérer le template via Singleton
        DocumentTemplate template = documentBundleTemplate.getTemplate(request.getDocumentType());
        
        // Préparer les données
        Map<String, String> data = prepareDocumentData(order, request);
        
        // Générer le contenu
        String generatedContent = template.generateDocument(data);
        
        // Sauvegarder le document
        DocumentEntity document = new DocumentEntity();
        document.setType(request.getDocumentType());
        document.setTitle(template.getTitle() + " - " + order.getId());
        document.setContent(generatedContent);
        document.setFormat("HTML");
        document.setOrder(order);
        document.setClient(order.getClient());
        document.setFileName("document_" + order.getId() + "_" + request.getDocumentType() + ".html");
        
        DocumentEntity saved = documentRepository.save(document);
        
        return mapToDTO(saved);
    }
    
    @Transactional
    public List<DocumentResponseDTO> generateOrderBundle(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        // Générer les 3 documents principaux
        generateDocument(createRequest(orderId, DocumentType.ORDER_FORM));
        generateDocument(createRequest(orderId, DocumentType.REGISTRATION_REQUEST));
        generateDocument(createRequest(orderId, DocumentType.TRANSFER_CERTIFICATE));
        
        // Retourner tous les documents de la commande
        return documentRepository.findByOrderId(orderId).stream()
            .map(this::mapToDTO)
            .toList();
    }
    
    @Transactional(readOnly = true)
    public List<DocumentResponseDTO> getDocumentsByOrder(Long orderId) {
        return documentRepository.findByOrderId(orderId).stream()
            .map(this::mapToDTO)
            .toList();
    }
    
    @Transactional(readOnly = true)
    public DocumentTemplateDTO getTemplate(DocumentType type) {
        DocumentTemplate template = documentBundleTemplate.getTemplate(type);
        DocumentTemplateDTO dto = new DocumentTemplateDTO();
        dto.setType(template.getType());
        dto.setTitle(template.getTitle());
        dto.setContent(template.getContent());
        dto.setPlaceholders(template.getPlaceholders());
        return dto;
    }
    
    private Map<String, String> prepareDocumentData(OrderEntity order, GenerateDocumentRequestDTO request) {
        Map<String, String> data = new HashMap<>();
        
        // Données de base
        data.put("{{order_id}}", order.getId().toString());
        data.put("{{order_date}}", order.getOrderDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        data.put("{{total_amount}}", order.getTotalAmount().toString());
        
        // Données client
        ClientEntity client = order.getClient();
        data.put("{{client_name}}", client.getName());
        data.put("{{client_address}}", client.getAddress());
        data.put("{{client_info}}", client.getName() + " - " + client.getEmail());
        
        // Données véhicule (premier véhicule de la commande)
        if (!order.getItems().isEmpty()) {
            OrderItemEntity firstItem = order.getItems().get(0);
            VehicleEntity vehicle = firstItem.getVehicle();
            data.put("{{vehicle_model}}", vehicle.getModel());
            data.put("{{vehicle_vin}}", "VIN-" + vehicle.getId()); // Exemple
            data.put("{{vehicle_details}}", vehicle.getModel() + " - " + vehicle.getYear());
        }
        
        // Données personnalisées
        if (request.getCustomData() != null) {
            data.putAll(request.getCustomData());
        }
        
        return data;
    }
    
    private GenerateDocumentRequestDTO createRequest(Long orderId, DocumentType type) {
        GenerateDocumentRequestDTO request = new GenerateDocumentRequestDTO();
        request.setOrderId(orderId);
        request.setDocumentType(type);
        return request;
    }
    
    private DocumentResponseDTO mapToDTO(DocumentEntity entity) {
        DocumentResponseDTO dto = new DocumentResponseDTO();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setFormat(entity.getFormat());
        dto.setOrderId(entity.getOrder() != null ? entity.getOrder().getId() : null);
        dto.setClientId(entity.getClient() != null ? entity.getClient().getId() : null);
        dto.setGeneratedAt(entity.getGeneratedAt());
        dto.setFileName(entity.getFileName());
        return dto;
    }
}