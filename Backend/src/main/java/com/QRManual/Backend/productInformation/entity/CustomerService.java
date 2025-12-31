package com.QRManual.Backend.productInformation.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
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
}