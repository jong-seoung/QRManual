package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.*;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.dto.UserDto;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.repository.CompanyInfoRepository;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductInformationService {
    private final AuthenticationService authenticationService;
    private final ProductInformationRepository productInformationRepository;
    private final CompanyInfoRepository companyInfoRepository;

    public ProductInformationResponse createProductInformation(ProductInformationRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = new ProductInformation();
        productInformation.setName(request.getName());
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

    public Page<ProductInformationResponse> getAllProductInformations(Pageable pageable){
        User user = authenticationService.getCurrentUser();
        return productInformationRepository
                .findByDeletedFalse(pageable)
                .map(ProductInformationResponse::from);
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

