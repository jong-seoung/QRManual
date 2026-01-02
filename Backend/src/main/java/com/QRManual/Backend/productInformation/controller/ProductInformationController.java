package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ProductInformationDetailResponse;
import com.QRManual.Backend.productInformation.dto.ProductInformationRequest;
import com.QRManual.Backend.productInformation.dto.ProductInformationResponse;
import com.QRManual.Backend.productInformation.service.ProductInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product-information")
@RequiredArgsConstructor
public class ProductInformationController {

    private final ProductInformationService productInformationService;

    @PostMapping("/create")
    public ProductInformationResponse createProductInformation(@RequestBody ProductInformationRequest request) {
        return productInformationService.createProductInformation(request);
    }

    @PutMapping("/edit/{productInformationId}")
    public ProductInformationResponse editProductInformation(@PathVariable Long productInformationId, @RequestBody ProductInformationRequest request){
        return productInformationService.editProductInformation(productInformationId, request);
    }

    @PostMapping("/test")
    public String test() {
        return "OK12";
    }

    @GetMapping("/detail/{productInformationId}")
    public ProductInformationDetailResponse getProductInformationDetail(@PathVariable Long productInformationId) {
        return productInformationService.getProductInformationDetail(productInformationId);
    }

    @DeleteMapping("/delete/{productInformationId}")
    public ResponseEntity<Void> deleteProductInformation(@PathVariable Long productInformationId){
        productInformationService.deleteProductInformation(productInformationId);
        return ResponseEntity.noContent().build();
    }
}
