package com.QRManual.Backend.productInformation.repository;

import com.QRManual.Backend.productInformation.entity.ProductBookmark;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductBookmarkRepository
        extends JpaRepository<ProductBookmark, Long> {

    boolean existsByUserAndProductInformation(User user, ProductInformation productInformation);

    Optional<ProductBookmark> findByUserAndProductInformation(User user, ProductInformation productInformation);

    List<ProductBookmark> findByUser(User user);
}
