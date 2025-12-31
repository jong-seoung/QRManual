package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManualRequest {
    private String language;
    private String pdfUrl;
}