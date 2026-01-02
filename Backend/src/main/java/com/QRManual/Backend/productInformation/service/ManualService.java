package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.ManualRequest;
import com.QRManual.Backend.productInformation.dto.ManualResponse;
import com.QRManual.Backend.productInformation.entity.Manual;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.ManualRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ManualService {

    private final AuthenticationService authenticationService;
    private final ManualRepository manualRepository;
    private final ProductInformationRepository productInformationRepository;

    public ManualResponse createManual(ManualRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        Manual manual = new Manual();
        manual.setProductInformation(productInformation);
        manual.setLanguage(request.getLanguage());
        manual.setPdfUrl(request.getPdfUrl());

        Manual saved = manualRepository.save(manual);

        return ManualResponse.builder()
                .id(saved.getId())
                .build();
    }

    @Transactional
    public ManualResponse editManual(Long manualId, ManualRequest request){
        User user = authenticationService.checkCompany();

        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        ProductInformation productInformation = manual.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        manual.setLanguage(request.getLanguage());
        manual.setPdfUrl(request.getPdfUrl());

        return ManualResponse.builder()
                .id(manual.getId())
                .build();
    }

    @Transactional
    public void deleteManual(Long manualId){
        User user = authenticationService.checkCompany();

        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = manual.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.removeManual(manual);

        manualRepository.delete(manual);
    }
}
