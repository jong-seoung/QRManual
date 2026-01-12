package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerServiceRepository extends JpaRepository<CustomerService, Long> {
}
