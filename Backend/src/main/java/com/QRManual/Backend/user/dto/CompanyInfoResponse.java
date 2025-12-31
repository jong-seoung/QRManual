package com.QRManual.Backend.user.dto;

import com.QRManual.Backend.user.entity.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyInfoResponse {
    private long id;

    private String name;
    private boolean officialMark;
    private String homePage;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
