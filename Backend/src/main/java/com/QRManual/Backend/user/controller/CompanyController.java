package com.QRManual.Backend.user.controller;

import com.QRManual.Backend.user.dto.CompanyInfoRequest;
import com.QRManual.Backend.user.dto.CompanyInfoResponse;
import com.QRManual.Backend.user.service.CompanyInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyInfoService companyInfoService;

    @PostMapping("/create")
    public CompanyInfoResponse createCompanyInfo(@RequestBody CompanyInfoRequest request){
        return companyInfoService.createCompanyInfo(request);
    }
}
