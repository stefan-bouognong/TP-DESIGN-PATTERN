package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class IteratorFilterDTO {
    private List<String> vehicleTypes;
    private Double minPrice;
    private Double maxPrice;
    private List<String> brands;
    private Boolean inStock;
    private Boolean onSale;
    private String searchKeyword;
    private Integer minYear;
    private Integer maxYear;
    private String sortBy; // "price_asc", "price_desc", "date_newest", "date_oldest"
    private Integer pageSize;
    private Integer pageNumber;
}