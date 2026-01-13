package com.QRManual.Backend.QRCode.repository;

import com.QRManual.Backend.QRCode.entity.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QRCodeRepository extends JpaRepository<QRCode, Long> {
}
