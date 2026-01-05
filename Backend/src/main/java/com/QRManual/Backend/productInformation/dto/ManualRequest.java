package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class ManualRequest {
    private String language;
    private String pdfUrl;
}