package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.FaqRequest;
import com.QRManual.Backend.productInformation.dto.FaqResponse;
import com.QRManual.Backend.productInformation.entity.Faq;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.FaqRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FaqService {
    private final AuthenticationService authenticationService;
    private final FaqRepository faqRepository;
    private final ProductInformationRepository productInformationRepository;

    public FaqResponse createFaq(FaqRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findById(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.getOwnedProductInformation(user, productInformation);

        Faq faq = new Faq();
        faq.setProductInformation(productInformation);
        faq.setAnswer(request.getAnswer());
        faq.setQuestion(request.getQuestion());

        Faq saved = faqRepository.save(faq);

        return FaqResponse.builder()
                .id(saved.getId())
                .build();
    }

}
