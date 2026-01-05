package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.CustomerServiceRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CustomerService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productInformation_id")
    private ProductInformation productInformation;

    private String phone;
    private String email;
    private String operationTime;
    private String chatLink;

    public static CustomerService from(ProductInformation productInformation, CustomerServiceRequest req) {
        CustomerService customerService = new CustomerService();
        customerService.productInformation = productInformation;
        customerService.phone = req.getPhone();
        customerService.email = req.getEmail();
        customerService.operationTime = req.getOperationTime();
        customerService.chatLink = req.getChatLink();
        return customerService;
    }

    public void update(CustomerServiceRequest request) {
        this.email = request.getEmail();
        this.phone = request.getPhone();
        this.chatLink = request.getChatLink();
        this.operationTime = request.getOperationTime();
    }
}