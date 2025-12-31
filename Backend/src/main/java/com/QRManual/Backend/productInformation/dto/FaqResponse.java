package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FaqResponse {
    private Long id;

    private String question;
    private String answer;
}
