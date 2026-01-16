// FormController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.FormRequestDTO;
import com.example.drive_deal.dto.FormResponseDTO;
import com.example.drive_deal.dto.RenderOptionsDTO;
import com.example.drive_deal.service.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormController {
    
    private final FormService formService;
    
    @PostMapping("/render")
    public ResponseEntity<FormResponseDTO> renderForm(@Valid @RequestBody FormRequestDTO request) {
        FormResponseDTO response = formService.renderForm(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/vehicle/{id}/html")
    public ResponseEntity<String> renderVehicleFormHtml(@PathVariable Long id) {
        FormRequestDTO request = new FormRequestDTO();
        request.setFormType("VEHICLE");
        request.setEntityId(id);
        request.setRendererType("HTML");
        
        FormResponseDTO response = formService.renderForm(request);
        
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "inline; filename=\"vehicle_form_" + id + ".html\"")
                .body(response.getContent());
    }
    
    @GetMapping("/vehicle/{id}/widget")
    public ResponseEntity<String> renderVehicleFormWidget(@PathVariable Long id) {
        FormRequestDTO request = new FormRequestDTO();
        request.setFormType("VEHICLE");
        request.setEntityId(id);
        request.setRendererType("WIDGET");
        
        FormResponseDTO response = formService.renderForm(request);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "inline; filename=\"vehicle_form_" + id + ".json\"")
                .body(response.getContent());
    }
    
    @GetMapping("/client/{id}/html")
    public ResponseEntity<String> renderClientFormHtml(@PathVariable Long id) {
        FormRequestDTO request = new FormRequestDTO();
        request.setFormType("CLIENT");
        request.setEntityId(id);
        request.setRendererType("HTML");
        
        FormResponseDTO response = formService.renderForm(request);
        
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "inline; filename=\"client_form_" + id + ".html\"")
                .body(response.getContent());
    }
    
    @GetMapping("/order/{id}/html")
    public ResponseEntity<String> renderOrderFormHtml(@PathVariable Long id) {
        FormRequestDTO request = new FormRequestDTO();
        request.setFormType("ORDER");
        request.setEntityId(id);
        request.setRendererType("HTML");
        
        FormResponseDTO response = formService.renderForm(request);
        
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "inline; filename=\"order_form_" + id + ".html\"")
                .body(response.getContent());
    }
    
    @PostMapping("/dynamic")
    public ResponseEntity<String> renderDynamicForm(
            @RequestParam String formType,
            @RequestParam Long entityId,
            @RequestParam(defaultValue = "HTML") String renderer,
            @RequestBody(required = false) RenderOptionsDTO options) {
        
        String content = formService.renderDynamicForm(formType, entityId, renderer, options);
        
        MediaType mediaType = "WIDGET".equalsIgnoreCase(renderer) ? 
                MediaType.APPLICATION_JSON : MediaType.TEXT_HTML;
        
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(content);
    }
    
    @GetMapping("/renderers")
    public ResponseEntity<String[]> getAvailableRenderers() {
        String[] renderers = formService.getAvailableRenderers();
        return ResponseEntity.ok(renderers);
    }
}