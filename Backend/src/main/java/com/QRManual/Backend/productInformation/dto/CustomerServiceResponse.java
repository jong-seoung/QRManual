package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerServiceResponse {
    private Long id;

    private String phone;
    private String email;
    private String operationTime;
    private String chatLink;
}