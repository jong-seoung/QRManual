package com.QRManual.Backend.productInformation.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class CustomerServiceRequest {
    private Long productInformation_id;

    private String phone;

    @Email(message = "Email should be valid")
    private String email;

    private String operationTime;

    private String chatLink;
}
