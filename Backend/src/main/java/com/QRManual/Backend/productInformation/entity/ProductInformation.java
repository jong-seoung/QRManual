package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name="product_information")
@Data
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
    private List<Manual> manuals;

    @OneToOne(mappedBy = "productInformation")
    private CustomerService customerService;


    @OneToMany(mappedBy = "productInformation")
    private List<Parts> partsList;

    @OneToMany(mappedBy = "productInformation")
    private List<Faq> faqs;

    public void removePart(Parts parts) {
        this.partsList.remove(parts);
        parts.setProductInformation(null);
    }
}
