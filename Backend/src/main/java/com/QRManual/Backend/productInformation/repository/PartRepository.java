package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.Parts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartRepository extends JpaRepository<Parts, Long> {
}
