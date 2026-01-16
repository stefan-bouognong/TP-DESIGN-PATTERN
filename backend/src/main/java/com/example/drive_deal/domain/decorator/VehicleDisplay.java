// VehicleDisplay.java (Component Interface)
package com.example.drive_deal.domain.decorator;

import com.example.drive_deal.entity.VehicleEntity;
import java.util.Map;

public interface VehicleDisplay {
    String display();
    VehicleEntity getVehicle();
    Map<String, Object> getDisplayAttributes();
    String getDisplayType();
}