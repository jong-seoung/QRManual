package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.CustomerService;
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

    public static CustomerServiceResponse fromEntity(CustomerService customerService){
        return CustomerServiceResponse.builder()
                .id(customerService.getId())
                .phone(customerService.getPhone())
                .email(customerService.getEmail())
                .operationTime(customerService.getOperationTime())
                .chatLink(customerService.getChatLink())
                .build();
    }
}