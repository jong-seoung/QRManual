package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.user.dto.UserDto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductInformationResponse {
    private Long id;
    private UserDto user;
    private String imageUrl;
    private String name;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
    private LocalDateTime createdAt;

    private boolean isSaved;
    private Long saveCount;

    public static ProductInformationResponse fromEntity(ProductInformation entity) {
        return ProductInformationResponse.builder()
                .id(entity.getId())
                .imageUrl(entity.getImageUrl())
                .user(UserDto.fromEntity(entity.getUser()))
                .name(entity.getName())
                .modelCode(entity.getModelCode())
                .releaseYear(entity.getReleaseYear())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
