package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.ProductInformationResponse;
import com.QRManual.Backend.productInformation.entity.ProductBookmark;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.ProductBookmarkRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductBookmarkService {

    private final ProductBookmarkRepository bookmarkRepository;
    private final ProductInformationRepository productRepository;
    private final AuthenticationService authenticationService;
    private final ProductBookmarkRepository productBookmarkRepository;

    public void bookmark(Long productId) {
        User user = authenticationService.getCurrentUser();
        ProductInformation product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("제품 없음"));

        if (bookmarkRepository.existsByUserAndProductInformation(user, product)) {
            return;
        }

        ProductBookmark bookmark = ProductBookmark.builder()
                .user(user)
                .productInformation(product)
                .build();

        bookmarkRepository.save(bookmark);
    }

    public void unbookmark(Long productId) {
        User user = authenticationService.getCurrentUser();

        ProductInformation product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("제품 없음"));

        ProductBookmark bookmark = bookmarkRepository
                .findByUserAndProductInformation(user, product)
                .orElseThrow(() -> new IllegalArgumentException("북마크 없음"));

        bookmarkRepository.delete(bookmark);
    }

    public List<ProductInformationResponse> myBookmarks() {
        User user = authenticationService.getCurrentUser();

        return productBookmarkRepository.findByUser(user)
                .stream()
                .map(bookmark ->
                        ProductInformationResponse.from(
                                bookmark.getProductInformation()
                        )
                )
                .toList();
    }
}