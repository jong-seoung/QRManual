package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.*;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.dto.UserDto;
import com.QRManual.Backend.user.entity.CompanyInfo;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductInformationService {
    private final AuthenticationService authenticationService;
    private final ProductInformationRepository productInformationRepository;

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
                    .phone(product.getCustomerService().getPhone())
                    .email(product.getCustomerService().getEmail())
                    .operationTime(product.getCustomerService().getOperationTime())
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
}

