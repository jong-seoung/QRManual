package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.Manual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManualRepository extends JpaRepository<Manual, Long> {
}
