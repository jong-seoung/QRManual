package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class PartsRequest {
    private Long productInformation_id;
    private String name;
    private String storeLink;
}