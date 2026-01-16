// DocumentBundleService.java (CORRIGÉ)
package com.example.drive_deal.service;

import com.example.drive_deal.domain.builder.DocumentBundle;
import com.example.drive_deal.domain.builder.DocumentBundleDirector;
import com.example.drive_deal.dto.DocumentBundleResponseDTO;
import com.example.drive_deal.entity.DocumentEntity;
import com.example.drive_deal.entity.OrderEntity;
import com.example.drive_deal.repository.DocumentRepository;
import com.example.drive_deal.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentBundleService {
    
    private final DocumentBundleDirector bundleDirector;
    private final OrderRepository orderRepository;
    private final DocumentRepository documentRepository;
    
    @Transactional
    public DocumentBundleResponseDTO createCompleteBundle(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        // Utiliser le Director pour construire le bundle
        DocumentBundle bundle = bundleDirector.constructCompleteBundle(order);
        
        // Persister les documents
        for (DocumentEntity document : bundle.getDocuments()) {
            documentRepository.save(document);
        }
        
        return mapToDTO(bundle);
    }
    
    @Transactional
    public DocumentBundleResponseDTO createMinimalBundle(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        DocumentBundle bundle = bundleDirector.constructMinimalBundle(order);
        
        for (DocumentEntity document : bundle.getDocuments()) {
            documentRepository.save(document);
        }
        
        return mapToDTO(bundle);
    }
    
    @Transactional
    public DocumentBundleResponseDTO createRegistrationBundle(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        DocumentBundle bundle = bundleDirector.constructRegistrationBundle(order);
        
        for (DocumentEntity document : bundle.getDocuments()) {
            documentRepository.save(document);
        }
        
        return mapToDTO(bundle);
    }
    
    @Transactional(readOnly = true)
    public DocumentBundleResponseDTO getBundleInfo(Long orderId) {
        List<DocumentEntity> documents = documentRepository.findByOrderId(orderId);
        
        if (documents.isEmpty()) {
            throw new IllegalArgumentException("No documents found for order: " + orderId);
        }
        
        DocumentBundle bundle = new DocumentBundle();
        bundle.setOrderId(orderId);
        bundle.setClientId(documents.get(0).getClient().getId());
        bundle.setBundleName("Existing Bundle - Order #" + orderId);
        bundle.setDocuments(documents);
        bundle.setCompleted(true);
        
        return mapToDTO(bundle);
    }
    
   // Dans DocumentBundleService.java - méthode generateBundleDownload
@Transactional
public String generateBundleDownload(Long orderId) {
    OrderEntity order = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    
    DocumentBundle bundle = bundleDirector.constructCompleteBundle(order);
    
    // NE PAS retourner un chemin relatif qui sera mal interprété
    // À la place, retourner juste un nom de fichier ou un identifiant
    return "bundle_order_" + orderId + ".zip";
}
    
    private DocumentBundleResponseDTO mapToDTO(DocumentBundle bundle) {
        DocumentBundleResponseDTO dto = new DocumentBundleResponseDTO();
        dto.setOrderId(bundle.getOrderId());
        dto.setClientId(bundle.getClientId());
        dto.setBundleName(bundle.getBundleName());
        dto.setDocumentCount(bundle.getDocumentCount());
        dto.setCompleted(bundle.isCompleted());
        dto.setDownloadPath(bundle.getDownloadPath());
        
        // Liste des documents
        List<String> documentTypes = bundle.getDocuments().stream()
            .map(doc -> doc.getType().name())
            .collect(Collectors.toList());
        dto.setDocumentTypes(documentTypes);
        
        return dto;
    }
}