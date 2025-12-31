package com.QRManual.Backend.user.service;

import com.QRManual.Backend.user.dto.CompanyInfoRequest;
import com.QRManual.Backend.user.dto.CompanyInfoResponse;
import com.QRManual.Backend.user.entity.CompanyInfo;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.repository.CompanyInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyInfoService {
    private final CompanyInfoRepository companyInfoRepository;
    private final AuthenticationService authenticationService;

    public CompanyInfoResponse createCompanyInfo(CompanyInfoRequest request){
        User user = authenticationService.checkCompany();

        CompanyInfo companyInfo = new CompanyInfo();
        companyInfo.setName(request.getName());
        companyInfo.setUser(user);
        companyInfo.setHomePage(request.getHomePage());
        companyInfo.setOfficialMark(request.isOfficialMark());

        CompanyInfo saved = companyInfoRepository.save(companyInfo);

        return CompanyInfoResponse.builder()
                .id(saved.getId())
                .build();
    }
}
