package com.QRManual.Backend.productInformation.dto;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class ProductInformationCreateRequest {
    @Valid
    private List<ManualRequest> manuals;

    @Valid
    private List<FaqRequest> faq;

    @Valid
    private List<PartsRequest> parts;

    @Valid
    private CustomerServiceRequest customerService;
}
