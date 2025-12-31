package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManualResponse {
    private Long id;

    private String language;
    private String pdfUrl;
}