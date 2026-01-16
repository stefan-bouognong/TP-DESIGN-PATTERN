// DocumentResponseDTO.java
package com.example.drive_deal.dto;

import com.example.drive_deal.domain.singleton.DocumentType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentResponseDTO {
    private Long id;
    private DocumentType type;
    private String title;
    private String content;
    private String format;
    private Long orderId;
    private Long clientId;
    private LocalDateTime generatedAt;
    private String fileName;
}