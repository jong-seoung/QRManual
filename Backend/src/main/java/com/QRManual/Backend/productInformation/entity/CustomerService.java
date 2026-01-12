package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.CustomerServiceRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
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

    public void update(CustomerServiceRequest request) {
        this.email = request.getEmail();
        this.phone = request.getPhone();
        this.chatLink = request.getChatLink();
        this.operationTime = request.getOperationTime();
    }
}