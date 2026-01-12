package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.ProductInformation;
import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class ProductInformationCreateRequest {

    private ProductInformation productInformation;

    @Valid
    private List<ManualRequest> manuals;

    @Valid
    private List<FaqRequest> faq;

    @Valid
    private List<PartsRequest> parts;

    @Valid
    private CustomerServiceRequest customerService;
}
