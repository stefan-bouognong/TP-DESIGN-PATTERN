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

import java.security.SecureRandom;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final VehicleRepository vehicleRepository;
    private final DocumentBundleTemplate documentBundleTemplate;

    private static final Random random = new SecureRandom();

    // Quelques WMI (World Manufacturer Identifier) réels pour plus de réalisme
    private static final String[] WMI_EXAMPLES = {
            "1FU", "2T1", "3VW", "4S3", "5FN", "JF1", "JH4", "KMH", "KND",
            "SAL", "WAU", "WVW", "WDD", "ZAM", "WP0", "SCB", "VSS", "TRU"
    };

    // Caractères autorisés dans un VIN (I, O, Q exclus)
    private static final char[] VALID_CHARS = "0123456789ABCDEFGHJKLMNPRSTUVWXYZ".toCharArray();

    @Transactional
    public DocumentResponseDTO generateDocument(GenerateDocumentRequestDTO request) {
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + request.getOrderId()));

        DocumentTemplate template = documentBundleTemplate.getTemplate(request.getDocumentType());

        Map<String, String> data = prepareDocumentData(order, request);

        String generatedContent = template.generateDocument(data);

        DocumentEntity document = new DocumentEntity();
        document.setType(request.getDocumentType());
        document.setTitle(template.getTitle() + " - Commande n°" + order.getId());
        document.setContent(generatedContent);
        document.setFormat("HTML");
        document.setOrder(order);
        document.setClient(order.getClient());
        document.setFileName("document_" + order.getId() + "_" + request.getDocumentType().name().toLowerCase() + ".html");

        DocumentEntity saved = documentRepository.save(document);

        return mapToDTO(saved);
    }

    @Transactional
    public List<DocumentResponseDTO> generateOrderBundle(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        // Générer les documents principaux
        generateDocument(createRequest(orderId, DocumentType.ORDER_FORM));
        generateDocument(createRequest(orderId, DocumentType.REGISTRATION_REQUEST));
        generateDocument(createRequest(orderId, DocumentType.TRANSFER_CERTIFICATE));
        // Optionnel : générer aussi la facture si besoin
        // generateDocument(createRequest(orderId, DocumentType.INVOICE));

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

    /**
     * Prépare toutes les données nécessaires pour remplacer les placeholders dans les templates
     */
    private Map<String, String> prepareDocumentData(OrderEntity order, GenerateDocumentRequestDTO request) {
        Map<String, String> data = new HashMap<>();

        // Données de base
        data.put("{{order_id}}", order.getId().toString());
        data.put("{{order_date}}", order.getOrderDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        data.put("{{total_amount}}", String.format("%,.0f", order.getSubtotal()) + " FCFA"); // Format monétaire propre

        // Données client
        ClientEntity client = order.getClient();
        data.put("{{client_name}}", client.getName());
        data.put("{{client_address}}", client.getAddress() != null ? client.getAddress() : "Non renseignée");
        data.put("{{client_info}}", client.getName() + " - " + client.getEmail());
        data.put("{{billing_info}}", client.getName() + "<br>" + client.getAddress() + "<br>Tél: " + client.getPhone());

        // Données véhicule (premier véhicule de la commande)
        if (!order.getItems().isEmpty()) {
            OrderItemEntity firstItem = order.getItems().get(0);
            VehicleEntity vehicle = firstItem.getVehicle();

            data.put("{{vehicle_model}}", vehicle.getModel());
            data.put("{{vehicle_year}}", String.valueOf(vehicle.getYear()));
            data.put("{{vehicle_details}}", vehicle.getModel() + " - " + vehicle.getYear());

            // GÉNÉRATION AUTOMATIQUE D'UN VIN RÉALISTE ET VALIDE
            String generatedVin = generateRealisticVin();
            data.put("{{vehicle_vin}}", generatedVin);

            // Quelques placeholders bonus souvent utiles
            data.put("{{first_registration}}", String.valueOf(vehicle.getYear()));
            data.put("{{sale_price}}", String.format("%,.0f", firstItem.getUnitPrice()) + " FCFA");
            data.put("{{sale_date}}", order.getOrderDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        }

        // Données personnalisées passées dans la requête
        if (request.getCustomData() != null) {
            data.putAll(request.getCustomData());
        }

        return data;
    }

    /**
     * Génère un VIN réaliste de 17 caractères avec chiffre de contrôle valide
     */
    private String generateRealisticVin() {
        StringBuilder vin = new StringBuilder(17);

        // 1. WMI (3 caractères) - Fabricant
        String wmi = WMI_EXAMPLES[random.nextInt(WMI_EXAMPLES.length)];
        vin.append(wmi);

        // 2. VDS (6 caractères aléatoires)
        for (int i = 0; i < 6; i++) {
            vin.append(VALID_CHARS[random.nextInt(VALID_CHARS.length)]);
        }

        // 3. Année (position 10)
        int year = 2018 + random.nextInt(9); // Entre 2018 et 2026
        char yearCode = getYearCode(year);
        vin.append(yearCode);

        // 4. Usine (position 11)
        vin.append(VALID_CHARS[random.nextInt(VALID_CHARS.length)]);

        // 5. Numéro de série (6 caractères)
        for (int i = 0; i < 6; i++) {
            vin.append(VALID_CHARS[random.nextInt(VALID_CHARS.length)]);
        }

        // 6. Calcul et insertion du chiffre de contrôle (position 9)
        char checkDigit = calculateCheckDigit(vin.toString());
        vin.insert(8, checkDigit); // Insère à l'index 8 → position 9

        return vin.toString();
    }

    private char getYearCode(int year) {
        return switch (year) {
            case 2018 -> 'J';
            case 2019 -> 'K';
            case 2020 -> 'L';
            case 2021 -> 'M';
            case 2022 -> 'N';
            case 2023 -> 'P';
            case 2024 -> 'R';
            case 2025 -> 'S';
            case 2026 -> 'T';
            case 2027 -> 'V';
            default -> 'X';
        };
    }

    private char calculateCheckDigit(String vinWithoutCheck) {
        String temp = vinWithoutCheck.substring(0, 8) + "0" + vinWithoutCheck.substring(8);
        int sum = 0;
        int[] weights = {8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2};

        for (int i = 0; i < 17; i++) {
            char c = temp.charAt(i);
            int value = transliterate(c);
            sum += value * weights[i];
        }

        int remainder = sum % 11;
        return remainder == 10 ? 'X' : (char) ('0' + remainder);
    }

    private int transliterate(char c) {
        return switch (c) {
            case 'A', 'J' -> 1;
            case 'B', 'K', 'S' -> 2;
            case 'C', 'L', 'T' -> 3;
            case 'D', 'M', 'U' -> 4;
            case 'E', 'N', 'V' -> 5;
            case 'F', 'W' -> 6;
            case 'G', 'P', 'X' -> 7;
            case 'H', 'Y' -> 8;
            case 'R', 'Z' -> 9;
            default -> c - '0';
        };
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