package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.Manual;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManualResponse {
    private Long id;

    private String language;
    private String pdfUrl;
    private String originFileName;
    private String ext;

    public static ManualResponse fromEntity(Manual manual) {
        return ManualResponse.builder()
                .id(manual.getId())
                .language(manual.getLanguage())
                .pdfUrl(manual.getPdfUrl())
                .originFileName(manual.getOriginFileName())
                .ext(manual.getExt())
                .build();
    }
}