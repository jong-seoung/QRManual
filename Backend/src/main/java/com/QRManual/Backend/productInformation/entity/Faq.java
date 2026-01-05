package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.productInformation.dto.FaqRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
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

    public static Faq from(ProductInformation productInformation, FaqRequest req) {
        Faq faq = new Faq();
        faq.productInformation = productInformation;
        faq.question = req.getQuestion();
        faq.answer = req.getAnswer();
        return faq;
    }

    public void update(FaqRequest request) {
        this.question = request.getQuestion();
        this.answer = request.getAnswer();
    }
}
