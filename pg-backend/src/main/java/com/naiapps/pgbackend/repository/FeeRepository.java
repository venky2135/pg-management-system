package com.naiapps.pgbackend.repository;

import com.naiapps.pgbackend.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    
    // ✅ Use JOIN FETCH to load student data with fees (prevents lazy loading issues)
    @Query("SELECT f FROM Fee f JOIN FETCH f.student s WHERE s.id = :studentId ORDER BY f.paymentDate DESC")
    List<Fee> findByStudentIdWithStudent(@Param("studentId") Long studentId);
    
    // ✅ Alternative: Simple query without JOIN FETCH (uses the mapped studentId column)
    List<Fee> findByStudent_IdOrderByPaymentDateDesc(Long studentId);
    
    // Find fees by student and status
    List<Fee> findByStudent_IdAndStatus(Long studentId, String status);
    
    // Find fees by date range
    List<Fee> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find fees by payment mode
    List<Fee> findByMode(String mode);
    
    // Custom query to get total amount paid by student
    @Query("SELECT COALESCE(SUM(f.amount), 0.0) FROM Fee f WHERE f.student.id = :studentId AND f.status = 'PAID'")
    Double getTotalPaidAmountByStudent(@Param("studentId") Long studentId);
}
