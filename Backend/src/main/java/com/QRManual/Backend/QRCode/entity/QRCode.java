package com.QRManual.Backend.QRCode.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class QRCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalUrl;
    private String imagePath;

    @Enumerated(EnumType.STRING)
    private QrTargetType targetType;

    private Long targetId;

    public QRCode(String originalUrl, String imagePath,
                  QrTargetType targetType, Long targetId) {
        this.originalUrl = originalUrl;
        this.imagePath = imagePath;
        this.targetType = targetType;
        this.targetId = targetId;
    }
}
