package com.QRManual.Backend.user.dto;

import com.QRManual.Backend.user.entity.CompanyInfo;
import com.QRManual.Backend.user.entity.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private long id;
    private String username;
    private String email;
    private String fullName;
    private String address;
    private String role;
    private String profileImageUrl;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private CompanyInfo companyInfo;

    public static UserDto fromEntity(User user){
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .companyInfo(user.getCompanyInfo())
                .build();
    }
}