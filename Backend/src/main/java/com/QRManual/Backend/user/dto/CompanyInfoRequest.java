package com.QRManual.Backend.user.dto;

import lombok.Data;

@Data
public class CompanyInfoRequest {
        private String name;
        private boolean officialMark;
        private String homePage;
    }
