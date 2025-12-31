package com.QRManual.Backend.productInformation.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductInformationDetailResponse {
    private ProductInformationResponse productInformation;
    private List<ManualResponse> manuals;
    private CustomerServiceResponse customerService;
    private List<PartsResponse> partsList;
    private List<FaqResponse> faqs;
}
