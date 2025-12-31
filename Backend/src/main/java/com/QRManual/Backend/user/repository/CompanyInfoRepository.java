package com.QRManual.Backend.user.repository;

import com.QRManual.Backend.user.entity.CompanyInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyInfoRepository extends JpaRepository<CompanyInfo, Long> {
}
