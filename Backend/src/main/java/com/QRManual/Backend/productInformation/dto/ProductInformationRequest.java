package com.QRManual.Backend.productInformation.dto;

import com.QRManual.Backend.productInformation.entity.CustomerService;
import com.QRManual.Backend.productInformation.entity.Faq;
import com.QRManual.Backend.productInformation.entity.Manual;
import com.QRManual.Backend.productInformation.entity.Parts;
import lombok.Data;

import java.util.List;

@Data
public class ProductInformationRequest {
    private String name;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
}
