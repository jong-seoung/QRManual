package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.user.dto.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductInformationResponse {
    private Long id;
    private UserDto user;
    private String name;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
    private boolean deleted;
}
