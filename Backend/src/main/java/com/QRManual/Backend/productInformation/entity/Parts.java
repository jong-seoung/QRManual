package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Parts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productInformation_id")
    private ProductInformation productInformation;

    private String name;
    private String storeLink;

    public static Parts from(ProductInformation productInformation, PartsRequest req) {
        Parts parts = new Parts();
        parts.productInformation = productInformation;
        parts.name = req.getName();
        parts.storeLink = req.getStoreLink();
        return parts;
    }

    public void update(PartsRequest request) {
        this.name = request.getName();
        this.storeLink = request.getStoreLink();
    }
}