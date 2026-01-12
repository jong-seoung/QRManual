package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.Parts;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartsResponse {
    private Long id;

    private String name;
    private String storeLink;
    private String imageUrl;

    public static PartsResponse fromEntity(Parts parts) {
        return PartsResponse.builder()
                .id(parts.getId())
                .name(parts.getName())
                .storeLink(parts.getStoreLink())
                .imageUrl(parts.getImageUrl())
                .build();
    }
}