package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.*;
import com.QRManual.Backend.productInformation.entity.*;
import com.QRManual.Backend.productInformation.repository.*;
import com.QRManual.Backend.user.dto.UserDto;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.repository.CompanyInfoRepository;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class ProductInformationService {
    private final AuthenticationService authenticationService;
    private final ProductInformationRepository productInformationRepository;
    private final CompanyInfoRepository companyInfoRepository;
    private final ProductBookmarkRepository productBookmarkRepository;

    private final CustomerServiceService customerServiceService;
    private final FaqService faqService;
    private final ManualService manualService;
    private final PartService partService;

    @Transactional
    public Long createAll(ProductInformationCreateRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = new ProductInformation();
        productInformation.setName(request.getProductInformation().getName());
        productInformation.setImageUrl(request.getProductInformation().getImageUrl());
        productInformation.setModelCode(request.getProductInformation().getModelCode());
        productInformation.setReleaseYear(request.getProductInformation().getReleaseYear());
        productInformation.setSerialNumberLocation(request.getProductInformation().getSerialNumberLocation());
        productInformation.setProductPage(request.getProductInformation().getProductPage());
        productInformation.setPublicStoreLink(request.getProductInformation().getPublicStoreLink());
        productInformation.setDeleted(false);
        productInformation.setUser(user);

        ProductInformation saved = productInformationRepository.save(productInformation);

        Long savedId = saved.getId();

        if (request.getManuals() != null && !request.getManuals().isEmpty()) {
            request.getManuals().forEach(manual ->
                    manualService.createManual(savedId, manual)
            );
        }

        if (request.getFaq() != null && !request.getFaq().isEmpty()) {
            request.getFaq().forEach(faq ->
                    faqService.createFaq(savedId, faq)
            );
        }

        if (request.getParts() != null && !request.getParts().isEmpty()) {
            request.getParts().forEach(part ->
                    partService.createPart(savedId, part)
            );
        }

        if (request.getCustomerService() != null) {
            customerServiceService.createCustomerService(savedId, request.getCustomerService());
        }

        return savedId;
    }


    public Page<ProductInformationResponse> getAllProductInformation(int page, int size, String  keyword, String sort){
        User user = authenticationService.getCurrentUser();

        Sort sortOption = switch (sort) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "viewCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sortOption);

        Page<ProductInformation> results;


        if (keyword == null || keyword.isBlank()) {
            results = productInformationRepository.findByDeletedFalse(pageable);
        } else {
            results = productInformationRepository
                    .findByDeletedFalseAndNameContaining(keyword, pageable);
        }

        return results.map(result -> {
            ProductInformationResponse response = ProductInformationResponse.fromEntity(result);
            boolean save = productBookmarkRepository.existsByUserAndProductInformation(user, result);
            Long saveCount = productBookmarkRepository.countByProductInformation(result.getId());

            response.setSaved(save);
            response.setSaveCount(saveCount);
            return response;
        });

    }

    public Page<ProductInformationResponse> getCompanyProductInformation(Long companyId, Pageable pageable) {
        User user = authenticationService.getCurrentUser();

        Long userId = companyInfoRepository.findById(companyId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다.")).getUser().getId();

        Page<ProductInformation> products =
                productInformationRepository.findByUserIdAndDeletedFalse(userId, pageable);

        return products.map(ProductInformationResponse::fromEntity);
    }

    public ProductInformationDetailResponse getProductInformationDetail(Long productInformationId){
        User user = authenticationService.getCurrentUser();

        ProductInformation product = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("제품을 찾을 수 없습니다."));

        ProductInformationResponse productInformation = ProductInformationResponse.builder()
                .id(product.getId())
                .user(UserDto.fromEntity(product.getUser()))
                .imageUrl(product.getImageUrl())
                .name(product.getName())
                .modelCode(product.getModelCode())
                .releaseYear(product.getReleaseYear())
                .serialNumberLocation(product.getSerialNumberLocation())
                .productPage(product.getProductPage())
                .publicStoreLink(product.getPublicStoreLink())
                .build();

        List<ManualResponse> manuals = product.getManuals().stream()
                .map(ManualResponse::fromEntity)
                .toList();

        List<PartsResponse> parts = product.getPartsList().stream()
                .map(PartsResponse::fromEntity)
                .toList();

        List<FaqResponse> faqs = product.getFaqs().stream()
                .map(FaqResponse::fromEntity)
                .toList();

        CustomerServiceResponse customerService = null;
        if (product.getCustomerService() != null) {
            customerService = CustomerServiceResponse.fromEntity(product.getCustomerService());
        }

        return ProductInformationDetailResponse.builder()
                .productInformation(productInformation)
                .manuals(manuals)
                .partsList(parts)
                .faqs(faqs)
                .customerService(customerService)
                .build();
    }

    @Transactional
    public Long updateProductInformation(Long productInformationId, ProductInformationCreateRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository
                .findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(() -> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.setName(request.getProductInformation().getName());
        productInformation.setImageUrl(request.getProductInformation().getImageUrl());
        productInformation.setModelCode(request.getProductInformation().getModelCode());
        productInformation.setReleaseYear(request.getProductInformation().getReleaseYear());
        productInformation.setSerialNumberLocation(request.getProductInformation().getSerialNumberLocation());
        productInformation.setProductPage(request.getProductInformation().getProductPage());
        productInformation.setPublicStoreLink(request.getProductInformation().getPublicStoreLink());

        List<ManualRequest> incomingManuals = request.getManuals() != null ? request.getManuals() : List.of();
        manualService.syncManuals(productInformation, incomingManuals);

        List<FaqRequest> incomingFaqs = request.getFaq() != null ? request.getFaq() : List.of();
        faqService.syncFaqs(productInformation, incomingFaqs);

        List<PartsRequest> incomingParts = request.getParts() != null ? request.getParts() : List.of();
        partService.syncParts(productInformation, incomingParts);

        if (request.getCustomerService() != null) {
            if (productInformation.getCustomerService() == null) {
                customerServiceService.createCustomerService(productInformation.getId(), request.getCustomerService());
            } else {
                customerServiceService.updateCustomerService(productInformation.getCustomerService().getId(), request.getCustomerService());
            }
        }

        return productInformation.getId();
    }

    public void deleteProductInformation(Long productInformationId){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findById(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.setDeleted(true);

        productInformationRepository.save(productInformation);
    }
}

