package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ProductInformationDetailResponse;
import com.QRManual.Backend.productInformation.dto.ProductInformationRequest;
import com.QRManual.Backend.productInformation.dto.ProductInformationResponse;
import com.QRManual.Backend.productInformation.service.ProductInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-information")
@RequiredArgsConstructor
public class ProductInformationController {

    private final ProductInformationService productInformationService;

    @PostMapping("/create")
    public ProductInformationResponse createProductInformation(@RequestBody ProductInformationRequest request) {
        return productInformationService.createProductInformation(request);
    }

    @PostMapping("/test")
    public String test() {
        return "OK12";
    }

    @GetMapping("/detail/{productInformationId}")
    public ProductInformationDetailResponse getProductInformationDetail(@PathVariable Long productInformationId) {
        return productInformationService.getProductInformationDetail(productInformationId);
    }
}
