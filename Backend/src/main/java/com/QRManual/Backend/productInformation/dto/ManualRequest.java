package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class ManualRequest {
    private Long id;

    private String language;
    private String pdfUrl;
    private String originFileName;
    private String ext;
}