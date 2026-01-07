package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Parts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productInformation_id")
    private ProductInformation productInformation;

    private String name;
    private String imageUrl;
    private String storeLink;

    public void update(PartsRequest request) {
        this.name = request.getName();
        this.storeLink = request.getStoreLink();
    }
}