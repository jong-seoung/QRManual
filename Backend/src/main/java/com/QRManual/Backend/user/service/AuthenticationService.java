package com.QRManual.Backend.user.service;

import com.QRManual.Backend.exception.AccessDeniedException;
import com.QRManual.Backend.exception.ResourceNotFoundException;
import com.QRManual.Backend.user.entity.CompanyInfo;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        String username;

        if (authentication.getPrincipal() instanceof User userPrincipal) {
            username = userPrincipal.getUsername();
        } else if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = authentication.getName();
        }

        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found for username: " + username));
    }

    public User checkCompany(){
        User currentUser = getCurrentUser();
        CompanyInfo companyInfo = currentUser.getCompanyInfo();

        if (currentUser.getRole() == null || !currentUser.getRole().equalsIgnoreCase("ROLE_COMPANY")) {
            throw new AccessDeniedException("기업 계정이 아닙니다.");
        }

        if (companyInfo == null){
            throw new IllegalStateException("회사 정보가 등록되지 않은 사용자 입니다.");
        }

        return currentUser;
    }
}