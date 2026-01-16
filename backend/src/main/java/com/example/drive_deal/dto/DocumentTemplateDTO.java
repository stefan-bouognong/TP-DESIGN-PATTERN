// DocumentTemplateDTO.java
package com.example.drive_deal.dto;

import com.example.drive_deal.domain.singleton.DocumentType;
import lombok.Data;
import java.util.Map;

@Data
public class DocumentTemplateDTO {
    private DocumentType type;
    private String title;
    private String content;
    private Map<String, String> placeholders;
}