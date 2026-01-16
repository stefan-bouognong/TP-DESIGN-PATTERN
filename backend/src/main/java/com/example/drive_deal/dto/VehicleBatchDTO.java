package com.example.drive_deal.dto;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.Data;
import java.util.List;

@Data
public class VehicleBatchDTO {
    private int batchNumber;
    private int batchSize;
    private int totalBatches;
    private int position;
    private int total;
    private List<VehicleEntity> vehicles;
    private boolean hasMore;
}