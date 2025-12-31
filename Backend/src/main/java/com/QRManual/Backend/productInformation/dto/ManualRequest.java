package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class ManualRequest {
    private Long productInformation_id;
    private String language;
    private String pdfUrl;
}