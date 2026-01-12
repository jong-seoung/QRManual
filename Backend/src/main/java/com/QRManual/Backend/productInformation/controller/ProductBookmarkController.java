package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ProductInformationResponse;
import com.QRManual.Backend.productInformation.entity.ProductBookmark;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.ProductBookmarkRepository;
import com.QRManual.Backend.productInformation.service.ProductBookmarkService;
import com.QRManual.Backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bookmark")
public class ProductBookmarkController {

    private final ProductBookmarkService bookmarkService;

    @PostMapping("/{productId}")
    public ResponseEntity<Void> bookmark(
            @PathVariable Long productId
    ) {
        bookmarkService.bookmark(productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> unbookmark(
            @PathVariable Long productId
    ) {
        bookmarkService.unbookmark(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProductInformationResponse>> myBookmarks(
    ) {
        return ResponseEntity.ok(bookmarkService.myBookmarks());
    }
}
