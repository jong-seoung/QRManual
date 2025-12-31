package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerServiceRequest {
    private String phone;
    private String email;
    private String operationTime;
    private String chatLink;
}
