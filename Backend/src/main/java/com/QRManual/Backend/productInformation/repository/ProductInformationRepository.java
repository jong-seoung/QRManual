package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.ProductInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductInformationRepository extends JpaRepository<ProductInformation, Long> {
    Optional<ProductInformation> findByIdAndDeletedFalse(Long id);
}
