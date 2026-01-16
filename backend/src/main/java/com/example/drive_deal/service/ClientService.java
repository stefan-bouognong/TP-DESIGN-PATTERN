// ClientService.java
package com.example.drive_deal.service;

import com.example.drive_deal.domain.composite.ClientComponent;
import com.example.drive_deal.domain.composite.ClientComposite;
import com.example.drive_deal.domain.composite.ClientLeaf;
import com.example.drive_deal.domain.composite.ClientAdapter;
import com.example.drive_deal.dto.ClientRequestDTO;
import com.example.drive_deal.dto.ClientResponseDTO;
import com.example.drive_deal.dto.CompanyStructureDTO;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.ClientRepository;
import com.example.drive_deal.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ClientAdapter clientAdapter;
    private final PasswordEncoder passwordEncoder;

    // ======================
    // CRÉATION CLIENT + USER
    // ======================
    public ClientResponseDTO createClient(ClientRequestDTO request) {

        // 1️⃣ Vérifier email unique
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email déjà utilisé");
        });

        // 2️⃣ Créer USER
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .isCompany("COMPANY".equalsIgnoreCase(request.getClientType()))
                .build();

        // 3️⃣ Créer CLIENT
        ClientEntity client = switch (request.getClientType().toUpperCase()) {
            case "INDIVIDUAL" -> createIndividualClient(request);
            case "COMPANY" -> createCompanyClient(request);
            default -> throw new IllegalArgumentException("Invalid client type");
        };

        // 4️⃣ Lier USER ↔ CLIENT
        client.setUser(user);
        user.setClient(client);

        // 5️⃣ Parent company (si filiale)
        if (request.getParentCompanyId() != null && client instanceof CompanyClientEntity company) {
            CompanyClientEntity parent = clientRepository.findById(request.getParentCompanyId())
                    .map(CompanyClientEntity.class::cast)
                    .orElseThrow(() -> new IllegalArgumentException("Parent company not found"));
            company.setParentCompany(parent);
            parent.addSubsidiary(company);
        }

        // 6️⃣ Sauvegarde UNIQUE (cascade)
        ClientEntity saved = clientRepository.save(client);

        return mapToResponseDTO(saved);
    }

    // ======================
    // FACTORY CLIENTS
    // ======================
    private IndividualClientEntity createIndividualClient(ClientRequestDTO request) {
        IndividualClientEntity c = new IndividualClientEntity();
        c.setName(request.getName());
        c.setEmail(request.getEmail());
        c.setPhone(request.getPhone());
        c.setAddress(request.getAddress());
        c.setFirstName(request.getFirstName());
        c.setLastName(request.getLastName());
        c.setNationality(request.getNationality());
        return c;
    }

    private CompanyClientEntity createCompanyClient(ClientRequestDTO request) {
        CompanyClientEntity c = new CompanyClientEntity();
        c.setName(request.getName());
        c.setEmail(request.getEmail());
        c.setPhone(request.getPhone());
        c.setAddress(request.getAddress());
        c.setCompanyId(request.getCompanyId());
        c.setVatNumber(request.getVatNumber());
        return c;
    }

    // ======================
    // MAPPING DTO
    // ======================
    private ClientResponseDTO mapToResponseDTO(ClientEntity entity) {
        ClientResponseDTO dto = new ClientResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setAddress(entity.getAddress());

        if (entity instanceof IndividualClientEntity i) {
            dto.setClientType("INDIVIDUAL");
            dto.setFirstName(i.getFirstName());
            dto.setLastName(i.getLastName());
            dto.setNationality(i.getNationality());
        }

        if (entity instanceof CompanyClientEntity c) {
            dto.setClientType("COMPANY");
            dto.setCompanyId(c.getCompanyId());
            dto.setVatNumber(c.getVatNumber());
            dto.setParentCompanyId(
                    c.getParentCompany() != null ? c.getParentCompany().getId() : null
            );

            ClientComponent component = clientAdapter.adapt(c);
            if (component instanceof ClientComposite composite) {
                dto.setFleetDiscount(composite.calculateFleetDiscount() * 100);
            }
        }

        return dto;
    }

    @Transactional
    public ClientResponseDTO addSubsidiary(Long parentCompanyId, ClientRequestDTO request) {
        if (!"COMPANY".equalsIgnoreCase(request.getClientType())) {
            throw new IllegalArgumentException("Subsidiary must be a COMPANY");
        }
        
        CompanyClientEntity parent = clientRepository.findById(parentCompanyId)
            .map(c -> {
                if (c instanceof CompanyClientEntity company) {
                    return company;
                } else {
                    throw new IllegalArgumentException("Parent must be a COMPANY client");
                }
            })
            .orElseThrow(() -> new IllegalArgumentException("Parent company not found"));
        
        // Vérifier email unique pour le nouveau user
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email déjà utilisé");
        });
        
        // Créer USER
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .isCompany(true)
                .build();
        
        // Créer COMPANY
        CompanyClientEntity subsidiary = createCompanyClient(request);
        subsidiary.setUser(user);
        user.setClient(subsidiary);
        
        // Établir la relation parent-filiale
        subsidiary.setParentCompany(parent);
        parent.addSubsidiary(subsidiary);
        
        clientRepository.save(subsidiary);
        clientRepository.save(parent);
        
        return mapToResponseDTO(subsidiary);
    }

    private CompanyStructureDTO buildStructureDTO(CompanyClientEntity company, int depth) { 
        CompanyStructureDTO dto = new CompanyStructureDTO(); 
        dto.setCompanyId(company.getId()); 
        dto.setCompanyName(company.getName()); 
        dto.setEmail(company.getEmail());
        // dto.setDepth(depth);
        
        // Récupérer les informations de réduction de flotte si disponible
        ClientComponent component = clientAdapter.adapt(company);
        if (component instanceof ClientComposite composite) {
            dto.setFleetDiscount(composite.calculateFleetDiscount() * 100);
        }
        
        // Récupérer les filiales récursivement
        if (company.getSubsidiaries() != null && !company.getSubsidiaries().isEmpty()) {
            List<CompanyStructureDTO> subsidiaryDTOs = company.getSubsidiaries().stream()
                .map(subsidiary -> buildStructureDTO(subsidiary, depth + 1))
                .collect(Collectors.toList());
            dto.setSubsidiaries(subsidiaryDTOs);
        }
        
        return dto;
    }
    
    @Transactional(readOnly = true)
    public CompanyStructureDTO getCompanyStructure(Long companyId) {
        ClientEntity client = clientRepository.findById(companyId)
            .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        
        if (!(client instanceof CompanyClientEntity company)) {
            throw new IllegalArgumentException("Client is not a COMPANY type");
        }
        
        return buildStructureDTO(company, 0);
    }
    
    @Transactional(readOnly = true)
    public List<ClientResponseDTO> getSubsidiaries(Long parentId) {
        List<ClientEntity> subsidiaries = clientRepository.findSubsidiariesByParentId(parentId);
        return subsidiaries.stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }
}