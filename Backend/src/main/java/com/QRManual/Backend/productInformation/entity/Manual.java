package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.ManualRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Manual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productInformation_id")
    private ProductInformation productInformation;

    private String language;
    private String pdfUrl;
    private String originFileName;
    private String ext;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDate updatedAt;

    public static Manual from(ProductInformation productInformation, ManualRequest req) {
        Manual manual = new Manual();
        manual.productInformation = productInformation;
        manual.language = req.getLanguage();
        manual.pdfUrl = req.getPdfUrl();
        manual.originFileName = req.getOriginFileName();
        manual.ext = req.getExt();
        return manual;
    }

    public void update(ManualRequest request) {
        this.language = request.getLanguage();
        this.pdfUrl = request.getPdfUrl();
    }

}