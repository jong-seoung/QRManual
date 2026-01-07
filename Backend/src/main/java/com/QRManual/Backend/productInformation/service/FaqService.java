package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.FaqRequest;
import com.QRManual.Backend.productInformation.dto.FaqResponse;
import com.QRManual.Backend.productInformation.entity.CustomerService;
import com.QRManual.Backend.productInformation.entity.Faq;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.FaqRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class FaqService {
    private final AuthenticationService authenticationService;
    private final FaqRepository faqRepository;
    private final ProductInformationRepository productInformationRepository;

    @Transactional
    public FaqResponse createFaq(Long productInformationId, FaqRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        Faq faq = Faq.builder()
                .productInformation(productInformation)
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .build();

        faq = faqRepository.save(faq);

        return FaqResponse.fromEntity(faq);
    }

    @Transactional
    public FaqResponse editFaq(Long faqId, FaqRequest request){
        User user = authenticationService.checkCompany();

        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = faq.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        faq.update(request);

        return FaqResponse.fromEntity(faq);
    }

    @Transactional
    public void deleteFaq(Long faqId){
        User user = authenticationService.checkCompany();

        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 수 없습니다."));

        ProductInformation productInformation = faq.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.removeFaq(faq);

        faqRepository.delete(faq);
    }

}
