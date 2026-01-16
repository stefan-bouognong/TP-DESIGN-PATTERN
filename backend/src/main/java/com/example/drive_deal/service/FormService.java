// FormService.java
package com.example.drive_deal.service;

import com.example.drive_deal.domain.bridge.*;
import com.example.drive_deal.dto.FormRequestDTO;
import com.example.drive_deal.dto.FormResponseDTO;
import com.example.drive_deal.dto.RenderOptionsDTO;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FormService {
    
    private final FormFactory formFactory;
    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    
    @Transactional(readOnly = true)
    public FormResponseDTO renderForm(FormRequestDTO request) {
        return switch (request.getFormType().toUpperCase()) {
            case "VEHICLE" -> renderVehicleForm(request);
            case "CLIENT" -> renderClientForm(request);
            case "ORDER" -> renderOrderForm(request);
            default -> throw new IllegalArgumentException("Unknown form type: " + request.getFormType());
        };
    }
    
    @Transactional(readOnly = true)
    public FormResponseDTO renderVehicleForm(FormRequestDTO request) {
        VehicleEntity vehicle = vehicleRepository.findById(request.getEntityId())
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + request.getEntityId()));
        
        Form form = formFactory.createVehicleForm(vehicle, request.getRendererType());
        
        // Configurer les options si c'est un VehicleForm
        if (form instanceof VehicleForm vehicleForm) {
            vehicleForm.setIncludeTechnicalDetails(
                request.getIncludeDetails() != null ? request.getIncludeDetails() : true);
        }
        
        String renderedContent = form.renderForm();
        
        return buildResponse(form, renderedContent, vehicle.getId());
    }
    
    @Transactional(readOnly = true)
    public FormResponseDTO renderClientForm(FormRequestDTO request) {
        ClientEntity client = clientRepository.findById(request.getEntityId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getEntityId()));
        
        Form form = formFactory.createClientForm(client, request.getRendererType());
        
        // Configurer les options
        if (form instanceof ClientForm clientForm) {
            if (client instanceof CompanyClientEntity) {
                clientForm.setIncludeCompanyDetails(
                    request.getIncludeDetails() != null ? request.getIncludeDetails() : true);
            }
        }
        
        String renderedContent = form.renderForm();
        
        return buildResponse(form, renderedContent, client.getId());
    }
    
    @Transactional(readOnly = true)
    public FormResponseDTO renderOrderForm(FormRequestDTO request) {
        OrderEntity order = orderRepository.findById(request.getEntityId())
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + request.getEntityId()));
        
        Form form = formFactory.createOrderForm(order, request.getRendererType());
        
        String renderedContent = form.renderForm();
        
        return buildResponse(form, renderedContent, order.getId());
    }
    
    @Transactional(readOnly = true)
    public String renderDynamicForm(String formType, Long entityId, String rendererType, RenderOptionsDTO options) {
        FormRequestDTO request = new FormRequestDTO();
        request.setFormType(formType);
        request.setEntityId(entityId);
        request.setRendererType(rendererType);
        
        FormResponseDTO response = renderForm(request);
        return response.getContent();
    }
    
    @Transactional(readOnly = true)
    public String[] getAvailableRenderers() {
        return formFactory.getAvailableRenderers();
    }
    
    private FormResponseDTO buildResponse(Form form, String content, Long entityId) {
        FormResponseDTO response = new FormResponseDTO();
        response.setFormType(form.getFormType());
        response.setRendererType(form.getRenderer().getRendererType());
        response.setTitle(form.getTitle());
        response.setContent(content);
        response.setEntityId(entityId);
        
        // Déterminer le MIME type
        if ("HTML".equals(form.getRenderer().getRendererType())) {
            response.setMimeType("text/html");
        } else if ("WIDGET".equals(form.getRenderer().getRendererType())) {
            response.setMimeType("application/json");
        }
        
        // Compter les champs (approximatif)
        int fieldCount = content.split("form-field|text_field").length - 1;
        response.setFieldCount(fieldCount);
        
        return response;
    }
}