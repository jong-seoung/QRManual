package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ProductInformationCreateRequest;
import com.QRManual.Backend.productInformation.dto.ProductInformationDetailResponse;
import com.QRManual.Backend.productInformation.dto.ProductInformationRequest;
import com.QRManual.Backend.productInformation.dto.ProductInformationResponse;
import com.QRManual.Backend.productInformation.service.ProductInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @PostMapping("{productInformationId}/create")
    public Long createSubAll(@PathVariable Long productInformationId, @RequestBody ProductInformationCreateRequest request) {
        return productInformationService.createSubAll(productInformationId, request);
    }

    @PutMapping("/edit/{productInformationId}")
    public ProductInformationResponse editProductInformation(@PathVariable Long productInformationId, @RequestBody ProductInformationRequest request){
        return productInformationService.editProductInformation(productInformationId, request);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductInformationResponse>> getAllProductInformation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "latest") String sort
    ){
        return ResponseEntity.ok(
                productInformationService.getAllProductInformations(page, size, keyword, sort)
        );
    }

    @GetMapping("/list/company/{companyId}")
    public ResponseEntity<Page<ProductInformationResponse>> getCompanyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable Long companyId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                productInformationService.getCompanyProductInformations(companyId, pageable)
        );
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
