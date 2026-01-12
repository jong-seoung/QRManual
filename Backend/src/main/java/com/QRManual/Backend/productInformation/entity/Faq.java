package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.FaqRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productInformation_id")
    private ProductInformation productInformation;

    private String question;
    private String answer;

    public void update(FaqRequest request) {
        this.question = request.getQuestion();
        this.answer = request.getAnswer();
    }
}
