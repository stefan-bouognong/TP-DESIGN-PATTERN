// BatchDecorationRequestDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class BatchDecorationRequestDTO {
    private List<Long> vehicleIds;
    private DecorationOptionsDTO options;
}