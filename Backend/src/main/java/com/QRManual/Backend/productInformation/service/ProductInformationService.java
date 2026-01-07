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

    private final CustomerServiceRepository customerServiceRepository;
    private final FaqRepository faqRepository;
    private final ManualRepository manualRepository;
    private final PartRepository partRepository;

    public ProductInformationResponse createProductInformation(ProductInformationRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = new ProductInformation();
        productInformation.setName(request.getName());
        productInformation.setImageUrl(request.getImageUrl());
        productInformation.setModelCode(request.getModelCode());
        productInformation.setReleaseYear(request.getReleaseYear());
        productInformation.setSerialNumberLocation(request.getSerialNumberLocation());
        productInformation.setProductPage(request.getProductPage());
        productInformation.setPublicStoreLink(request.getPublicStoreLink());
        productInformation.setDeleted(false);
        productInformation.setUser(user);

        ProductInformation saved = productInformationRepository.save(productInformation);

        return ProductInformationResponse.builder()
                .id(saved.getId())
                .build();
    }

    @Transactional
    public Long createSubAll(Long productInformationId, ProductInformationCreateRequest request){
        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        if (request.getManuals() != null && !request.getManuals().isEmpty()) {
            manualRepository.saveAll(
                    request.getManuals().stream()
                            .map(m -> Manual.from(productInformation, m))
                            .toList()
            );
        }

        if (request.getFaq() != null && !request.getFaq().isEmpty()) {
            log.info("FAQ 요청 데이터: {}", request.getFaq());
            faqRepository.saveAll(
                    request.getFaq().stream()
                            .map(f -> Faq.from(productInformation, f))
                            .toList()
            );
        }

        if (request.getParts() != null && !request.getParts().isEmpty()) {
            partRepository.saveAll(
                    request.getParts().stream()
                            .map(p -> Parts.from(productInformation, p))
                            .toList()
            );
        }

        if (request.getCustomerService() != null) {
            CustomerService customerService =
                    CustomerService.from(productInformation, request.getCustomerService());
            customerServiceRepository.save(customerService);
        }

        return productInformationId;
    }

    @Transactional
    public ProductInformationResponse editProductInformation(Long productInformationId, ProductInformationRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.setName(request.getName());
        productInformation.setModelCode(request.getModelCode());
        productInformation.setReleaseYear(request.getReleaseYear());
        productInformation.setSerialNumberLocation(request.getSerialNumberLocation());
        productInformation.setProductPage(request.getProductPage());
        productInformation.setPublicStoreLink(request.getPublicStoreLink());

        return ProductInformationResponse.builder()
                .id(productInformation.getId())
                .build();
    }

    public Page<ProductInformationResponse> getAllProductInformations(int page, int size, String  keyword, String sort){
        User user = authenticationService.getCurrentUser();

        Sort sortOption = switch (sort) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "viewCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sortOption);

        Page<ProductInformation> result;


        if (keyword == null || keyword.isBlank()) {
            result = productInformationRepository.findByDeletedFalse(pageable);
        } else {
            result = productInformationRepository
                    .findByDeletedFalseAndNameContaining(keyword, pageable);
        }

        return result.map(ProductInformationResponse::from);
    }

    public Page<ProductInformationResponse> getCompanyProductInformations(Long companyId, Pageable pageable) {
        User user = authenticationService.getCurrentUser();

        Long userId = companyInfoRepository.findById(companyId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다.")).getUser().getId();

        Page<ProductInformation> products =
                productInformationRepository.findByUserIdAndDeletedFalse(userId, pageable);

        return products.map(ProductInformationResponse::from);
    }

    public ProductInformationDetailResponse getProductInformationDetail(Long productInformationId){
        User user = authenticationService.getCurrentUser();

        ProductInformation product = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("제품을 찾을 수 없습니다."));

        ProductInformationResponse productInformation = ProductInformationResponse.builder()
                .id(product.getId())
                .user(UserDto.fromEntity(product.getUser()))
                .name(product.getName())
                .modelCode(product.getModelCode())
                .releaseYear(product.getReleaseYear())
                .serialNumberLocation(product.getSerialNumberLocation())
                .productPage(product.getProductPage())
                .publicStoreLink(product.getPublicStoreLink())
                .build();

        List<ManualResponse> manuals = product.getManuals().stream()
                .map(manual -> ManualResponse.builder()
                        .id(manual.getId())
                        .language(manual.getLanguage())
                        .pdfUrl(manual.getPdfUrl())
                        .build())
                .toList();

        List<PartsResponse> parts = product.getPartsList().stream()
                .map(part -> PartsResponse.builder()
                        .id(part.getId())
                        .name(part.getName())
                        .storeLink(part.getStoreLink())
                        .build())
                .toList();

        List<FaqResponse> faqs = product.getFaqs().stream()
                .map(faq -> FaqResponse.builder()
                        .id(faq.getId())
                        .question(faq.getQuestion())
                        .answer(faq.getAnswer())
                        .build())
                .toList();

        CustomerServiceResponse customerService = null;
        if (product.getCustomerService() != null) {
            customerService = CustomerServiceResponse.builder()
                    .id(product.getCustomerService().getId())
                    .phone(product.getCustomerService().getPhone())
                    .email(product.getCustomerService().getEmail())
                    .operationTime(product.getCustomerService().getOperationTime())
                    .chatLink(product.getCustomerService().getChatLink())
                    .build();
        }

        // 6. 최종 응답 조립
        return ProductInformationDetailResponse.builder()
                .productInformation(productInformation)
                .manuals(manuals)
                .partsList(parts)
                .faqs(faqs)
                .customerService(customerService)
                .build();
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

