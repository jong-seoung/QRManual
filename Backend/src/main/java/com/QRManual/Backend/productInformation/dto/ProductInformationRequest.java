package com.QRManual.Backend.productInformation.dto;

import lombok.Data;

@Data
public class ProductInformationRequest {
    private String name;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
}
