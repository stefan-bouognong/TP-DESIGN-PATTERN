package com.example.drive_deal.service.impl;

import com.example.drive_deal.domain.document.DocumentType;
import com.example.drive_deal.domain.document.OrderDocumentData;
import com.example.drive_deal.dto.ClientResponseDTO;
import com.example.drive_deal.dto.OrderResponseDTO;
import com.example.drive_deal.service.DocumentService2;
import com.example.drive_deal.service.OrderService;
import com.example.drive_deal.utils.HtmlTemplateProcessor;
import com.example.drive_deal.utils.PdfGenerator;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService2 {

    private final OrderService orderService;
    private final HtmlTemplateProcessor htmlProcessor;
    private final PdfGenerator pdfGenerator;

    public DocumentServiceImpl(
            OrderService orderService,
            HtmlTemplateProcessor htmlProcessor,
            PdfGenerator pdfGenerator
    ) {
        this.orderService = orderService;
        this.htmlProcessor = htmlProcessor;
        this.pdfGenerator = pdfGenerator;
    }

    @Override
    public byte[] generateHtml(Long orderId, DocumentType type) {
        OrderResponseDTO order = orderService.getOrder(orderId);
        OrderDocumentData data = mapToDocumentData(order, type);

        String template = resolveTemplate(type);
        String html = htmlProcessor.process(template, data);

        return html.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generatePdf(Long orderId, DocumentType type) {
        String html = new String(generateHtml(orderId, type), StandardCharsets.UTF_8);
        return pdfGenerator.generateFromHtml(html);
    }

    private String resolveTemplate(DocumentType type) {
        return switch (type) {
            case BON_COMMANDE -> "documents/bon-commande.html";
            case DEMANDE_IMMATRICULATION -> "documents/demande-immatriculation.html";
            case CERTIFICAT_CESSION -> "documents/certificat-cession.html";
        };
    }

    private OrderDocumentData mapToDocumentData(OrderResponseDTO order, DocumentType type) {

        OrderDocumentData data = new OrderDocumentData();

        /* ======================
           Infos commande
           ====================== */
        data.setOrderId(order.getId());
        data.setOrderDate(order.getOrderDate());
        data.setOrderType(order.getOrderType());
        data.setSubtotal(order.getSubtotal());
        data.setTotalAmount(order.getTotalAmount());
        data.setTotalTax(order.getTotalTax());
        data.setItems(order.getItems() != null ? order.getItems() : List.of());

        /* ======================
           Infos client (PRIORITÉ client DTO)
           ====================== */
        ClientResponseDTO client = order.getClient();

        if (client != null) {
            data.setClientFullName(order.getClientName());
            data.setClientEmail(client.getEmail());
            data.setClientPhone(client.getPhone());
            data.setClientAddress(client.getAddress());
        } else {
            // Fallback ancien champ
            data.setClientFullName(order.getClientName());
        }

        /* ======================
           Adresses
           ====================== */
        data.setBillingAddress(order.getBillingAddress());
        data.setShippingAddress(order.getShippingAddress());

        /* ======================
           Paiement CASH
           ====================== */
        data.setPaid(order.getPaid());
        data.setCashDiscount(order.getCashDiscount());

        /* ======================
           Paiement CREDIT
           ====================== */
        data.setMonths(order.getMonths());
        data.setInterestRate(order.getInterestRate());
        data.setMonthlyPayment(order.getMonthlyPayment());
        data.setApproved(order.getApproved());

        /* ======================
           Meta document
           ====================== */
        data.setGeneratedAt(LocalDateTime.now());
        data.setDocumentTitle(type.name());

        return data;
    }

    private String safe(String value) {
        return value != null ? value : "";
    }
}
