package com.example.drive_deal.dto;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.Data;
import java.util.List;

@Data
public class CatalogPageDTO {
    private int pageNumber;
    private int pageSize;
    private int totalPages;
    private long totalElements;
    private boolean hasNext;
    private boolean hasPrevious;
    private List<VehicleEntity> content;
    
    public static CatalogPageDTO of(int pageNumber, int pageSize, 
                                   long totalElements, List<VehicleEntity> content) {
        CatalogPageDTO dto = new CatalogPageDTO();
        dto.setPageNumber(pageNumber);
        dto.setPageSize(pageSize);
        dto.setTotalElements(totalElements);
        dto.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
        dto.setHasNext(pageNumber < dto.getTotalPages());
        dto.setHasPrevious(pageNumber > 1);
        dto.setContent(content);
        return dto;
    }
}