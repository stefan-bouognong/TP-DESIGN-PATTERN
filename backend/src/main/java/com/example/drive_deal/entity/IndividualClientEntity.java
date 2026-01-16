// IndividualClientEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@DiscriminatorValue("INDIVIDUAL")
@Data
public class IndividualClientEntity extends ClientEntity {
    private String firstName;
    private String lastName;
    private String nationality;
}