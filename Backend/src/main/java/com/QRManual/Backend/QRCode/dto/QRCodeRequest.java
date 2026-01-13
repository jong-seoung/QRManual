package com.QRManual.Backend.QRCode.dto;

import com.QRManual.Backend.QRCode.entity.QrTargetType;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class QRCodeRequest {
    private String originalUrl;
    private QrTargetType targetType;
    private Long targetId;
}
