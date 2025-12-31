package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FaqRequest {
    private String question;
    private String answer;
}
