package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.Faq;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FaqResponse {
    private Long id;

    private String question;
    private String answer;

    public static FaqResponse fromEntity(Faq faq) {
        return FaqResponse.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .build();
    }

}
