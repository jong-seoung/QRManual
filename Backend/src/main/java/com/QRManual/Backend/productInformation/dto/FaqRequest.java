package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class FaqRequest {
    private Long id;

    private String question;
    private String answer;
}
