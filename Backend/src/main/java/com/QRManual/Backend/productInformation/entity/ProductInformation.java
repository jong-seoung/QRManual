package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="product_information")
@Getter
@Setter
@NoArgsConstructor
public class ProductInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String modelCode;
    private Integer releaseYear;
    private String serialNumberLocation;
    private String productPage;
    private String publicStoreLink;
    private boolean deleted;

    @OneToMany(mappedBy = "productInformation")
    private List<Manual> manuals = new ArrayList<>();;

    @OneToOne(mappedBy = "productInformation")
    private CustomerService customerService;


    @OneToMany(mappedBy = "productInformation")
    private List<Parts> partsList = new ArrayList<>();;

    @OneToMany(mappedBy = "productInformation")
    private List<Faq> faqs = new ArrayList<>(); ;

    public void removeManual(Manual manual){
        this.manuals.remove(manual);
        manual.setProductInformation(null);
    }

    public void removeCustomerService() {
        if (this.customerService != null) {
            this.customerService.setProductInformation(null);
            this.customerService = null;
        }
    }

    public void removePart(Parts parts) {
        this.partsList.remove(parts);
        parts.setProductInformation(null);
    }

    public void removeFaq(Faq faq){
        this.faqs.remove(faq);
        faq.setProductInformation(null);
    }
}
