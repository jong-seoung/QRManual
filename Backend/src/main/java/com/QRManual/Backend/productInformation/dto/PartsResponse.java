package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartsResponse {
    private Long id;

    private String name;
    private String storeLink;
}