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

    public FaqResponse createFaq(FaqRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        Faq faq = new Faq();
        faq.setProductInformation(productInformation);
        faq.setAnswer(request.getAnswer());
        faq.setQuestion(request.getQuestion());

        Faq saved = faqRepository.save(faq);

        return FaqResponse.builder()
                .id(saved.getId())
                .build();
    }

    @Transactional
    public FaqResponse editFaq(Long faqId, FaqRequest request){
        User user = authenticationService.checkCompany();

        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = faq.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());

        return FaqResponse.builder()
                .id(faq.getId())
                .build();
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
