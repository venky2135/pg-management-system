package com.naiapps.pgbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore  // ✅ Prevent JSON serialization of student object
    private Student student;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String status = "PAID";

    @NotNull(message = "Payment date is required")
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @NotNull(message = "Payment mode is required")
    @Column(nullable = false)
    private String mode;

    // ✅ Store student ID directly to avoid lazy loading
    @Column(name = "student_id", insertable = false, updatable = false)
    private Long studentId;

    // ✅ Remove problematic helper methods that trigger lazy loading
    // These methods were causing the LazyInitializationException
}
