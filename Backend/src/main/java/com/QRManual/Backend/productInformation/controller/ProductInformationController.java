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
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product-information")
@RequiredArgsConstructor
public class ProductInformationController {

    private final ProductInformationService productInformationService;

    @PostMapping("/createAll")
    public Long createSubAll(@RequestBody ProductInformationCreateRequest request) {
        return productInformationService.createAll(request);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductInformationResponse>> getAllProductInformation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "latest") String sort
    ){
        return ResponseEntity.ok(
                productInformationService.getAllProductInformation(page, size, keyword, sort)
        );
    }

    @GetMapping("/list/company/{companyId}")
    public ResponseEntity<Page<ProductInformationResponse>> getCompanyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable Long companyId
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(
                productInformationService.getCompanyProductInformation(companyId, pageable)
        );
    }

    @GetMapping("/detail/{productInformationId}")
    public ProductInformationDetailResponse getProductInformationDetail(@PathVariable Long productInformationId) {
        return productInformationService.getProductInformationDetail(productInformationId);
    }

    @PutMapping("/update/{productInformationId}")
    public Long updateProductInformation(@PathVariable Long productInformationId, @RequestBody ProductInformationCreateRequest request){
        return productInformationService.updateProductInformation(productInformationId, request);
    }

    @DeleteMapping("/delete/{productInformationId}")
    public ResponseEntity<Void> deleteProductInformation(@PathVariable Long productInformationId){
        productInformationService.deleteProductInformation(productInformationId);
        return ResponseEntity.noContent().build();
    }
}
