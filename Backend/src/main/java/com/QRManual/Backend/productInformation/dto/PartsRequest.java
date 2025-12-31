package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartsRequest {
    private String name;
    private String storeLink;
}