package com.QRManual.Backend.productInformation.dto;

import lombok.Data;

@Data
public class ProductInformationRequest {
    private Long id;
    private String name;
    private String imageUrl;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
}
