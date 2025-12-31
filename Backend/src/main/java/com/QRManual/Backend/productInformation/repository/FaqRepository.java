package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<Faq, Long> {
}
