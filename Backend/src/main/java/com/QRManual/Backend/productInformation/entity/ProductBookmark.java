package com.QRManual.Backend.productInformation.entity;

import com.QRManual.Backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "product_bookmark",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "product_information_id"})
        }
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_information_id", nullable = false)
    private ProductInformation productInformation;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
