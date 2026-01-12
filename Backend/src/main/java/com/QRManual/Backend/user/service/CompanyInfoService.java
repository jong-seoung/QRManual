package com.QRManual.Backend.user.service;

import com.QRManual.Backend.exception.AccessDeniedException;
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
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser.getRole() == null || !currentUser.getRole().equalsIgnoreCase("ROLE_COMPANY")) {
            throw new AccessDeniedException("기업 계정이 아닙니다.");
        }

        CompanyInfo companyInfo = new CompanyInfo();
        companyInfo.setName(request.getName());
        companyInfo.setUser(currentUser);
        companyInfo.setHomePage(request.getHomePage());
        companyInfo.setOfficialMark(request.isOfficialMark());

        CompanyInfo saved = companyInfoRepository.save(companyInfo);

        return CompanyInfoResponse.builder()
                .id(saved.getId())
                .build();
    }
}
